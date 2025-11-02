/**
 * Documents routes: upload, list, view, delete, share
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const { requireAuth } = require('../middleware/auth');
const { firestore } = require('../config/firebase');
const { PINATA_JWT } = require('../config/pinataConfig');

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${unique}-${safeName}`);
  }
});

const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// Helper: log action
async function addLog(userUid, fileName, action, details = '') {
  try {
    await firestore.collection('logs').add({
      userUid,
      fileName,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

// Notifications integration (lazy require to avoid cycles)
const { sendNotification } = (() => {
  try { return require('./notifications'); } catch (e) { return { sendNotification: async () => {} }; }
})();

// POST /api/documents/upload
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const uid = req.user.uid;
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

    const file = req.file;
    const localPath = path.join(uploadsDir, file.filename);

    // Local upload completed (multer already saved the file)
    let ipfsCid = null;
    console.log('✅ Local upload completed:', localPath);

    // Pin to Pinata (optional) - read JWT from config file
    try {
      const { PINATA_JWT } = require('../config/pinataConfig');
      if (PINATA_JWT) {
        const form = new FormData();
        form.append('file', fs.createReadStream(localPath), { filename: file.originalname });

        const pinataRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
            ...form.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 120000
        });

        ipfsCid = pinataRes?.data?.IpfsHash || pinataRes?.data?.IpfsHash || pinataRes?.data?.hash || null;
        if (ipfsCid) console.log('✅ File pinned to Pinata:', ipfsCid);
      } else {
        console.error('⚠️ Pinata upload skipped: PINATA_JWT not configured in backend/config/pinataConfig.js');
      }
    } catch (error) {
      // Log more details to help diagnose 401/403 from Pinata
      console.error('⚠️ Pinata upload skipped:', error?.message || error);
      if (error && error.response) {
        try { console.error('Pinata response status:', error.response.status); } catch (e) {}
        try { console.error('Pinata response data:', JSON.stringify(error.response.data)); } catch (e) { console.error('Pinata response data could not be stringified'); }
      }
      // proceed without failing the upload
    }

    // Store metadata in Firestore
    const docRef = await firestore.collection('documents').add({
      ownerUid: uid,
      fileName: file.originalname,
      localFilename: file.filename,
      localPath: `/uploads/${file.filename}`,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadDate: new Date().toISOString(),
      ipfsCid,
      encrypted: false,
      status: 'active'
    });

    // Log upload
    await addLog(uid, file.originalname, 'upload', `Uploaded to local and pinata: ${ipfsCid || 'no-cid'}`);

  // Notify uploader (they receive confirmation)
  try { await sendNotification(req.user.email, 'upload', `You uploaded ${file.originalname}`, file.originalname, req.user.email); } catch (e) {}

    return res.json({ success: true, message: 'Upload complete', documentId: docRef.id, ipfsCid });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// GET /api/documents/list
router.get('/list', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snap = await firestore.collection('documents').where('ownerUid', '==', uid).orderBy('uploadDate', 'desc').get();
    const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.json(docs);
  } catch (err) {
    console.error('List error:', err);
    return res.status(500).json({ error: 'Failed to list documents' });
  }
});

// GET /api/documents/view/:id
router.get('/view/:id', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;
    const docRef = await firestore.collection('documents').doc(id).get();
    if (!docRef.exists) return res.status(404).send('Document not found');
    const doc = docRef.data();
    if (doc.ownerUid !== uid) return res.status(403).send('Forbidden');

    const localFilename = doc.localFilename;
    if (!localFilename) return res.status(404).send('Local copy not available');

    const filePath = path.join(uploadsDir, localFilename);
    if (!fs.existsSync(filePath)) return res.status(404).send('File missing');

    // Log view event
    try {
      await addLog(uid, doc.fileName || '', 'view', `Owner viewed file ${doc.fileName || ''}`);
    } catch (e) { console.warn('Failed to write view log', e); }

    // Set content type and stream file
    res.setHeader('Content-Type', doc.fileType || 'application/octet-stream');
    res.sendFile(filePath);
  } catch (err) {
    console.error('View error:', err);
    return res.status(500).send('Failed to retrieve file');
  }
});

// DELETE /api/documents/delete/:id
router.delete('/delete/:id', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const id = req.params.id;
    const docRef = firestore.collection('documents').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Document not found' });
    const doc = snap.data();
    if (doc.ownerUid !== uid) return res.status(403).json({ success: false, message: 'Forbidden' });

    // Delete local file
    const localFilename = doc.localFilename;
    if (localFilename) {
      const filePath = path.join(uploadsDir, localFilename);
      try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) { console.warn('Failed to delete local file', e); }
    }

    // Unpin from Pinata if ipfsCid exists
    const ipfsCid = doc.ipfsCid;
    const pinataJwt = PINATA_JWT || process.env.PINATA_JWT || process.env.PINATA_API_JWT;
    if (ipfsCid && pinataJwt) {
      try {
        await axios.delete(`https://api.pinata.cloud/pinning/unpin/${ipfsCid}`, {
          headers: { Authorization: `Bearer ${pinataJwt}` }
        });
      } catch (e) {
        console.warn('Failed to unpin from Pinata', e?.response?.data || e.message);
      }
    }

    // Update Firestore status
    await docRef.update({ status: 'deleted', deletedOn: new Date().toISOString() });

    // Log delete
    await addLog(uid, doc.fileName, 'delete', `Deleted local and unpinned: ${ipfsCid || 'no-cid'}`);

    return res.json({ success: true, message: 'Document deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    return res.status(500).json({ success: false, message: 'Delete failed' });
  }
});

// GET /api/documents/share/:id -> redirect to frontend share page with query
router.get('/share/:id', requireAuth, async (req, res) => {
  const id = req.params.id;
  return res.redirect(`/HTML/share.html?fileId=${encodeURIComponent(id)}`);
});

module.exports = router;
