/**
 * Shares routes: create, list, revoke, view by token
 */
const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');
const { firestore } = require('../config/firebase');

const router = express.Router();

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

// POST /api/shares/create
router.post('/create', requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user.uid;
    const { documentId, recipientEmail, permission, expiry } = req.body || {};
    if (!documentId || !recipientEmail || !permission) return res.status(400).json({ success: false, message: 'Missing fields' });

    // compute expiry timestamp
    let expiryTime = null;
    if (expiry && expiry !== 'never') {
      const now = new Date();
      if (expiry.endsWith('d')) {
        const days = Number(expiry.replace('d','')) || 0;
        expiryTime = new Date(now.getTime() + days * 24*60*60*1000).toISOString();
      } else if (expiry.endsWith('m')) {
        const months = Number(expiry.replace('m','')) || 0;
        const dt = new Date(now);
        dt.setMonth(dt.getMonth() + months);
        expiryTime = dt.toISOString();
      } else if (/^\d{4}-\d{2}-\d{2}T/.test(expiry)) {
        expiryTime = new Date(expiry).toISOString();
      }
    }

    // generate a token
    const token = crypto.randomBytes(16).toString('hex');

    // create share entry
    const shareRef = await firestore.collection('shares').add({
      ownerUid,
      documentId,
      recipientEmail,
      permission,
      expiryTime: expiryTime || null,
      token,
      revoked: false,
      createdOn: new Date().toISOString()
    });

    // get document name for logging
    const docSnap = await firestore.collection('documents').doc(documentId).get();
    const fileName = docSnap.exists ? (docSnap.data().fileName || '') : '';

    await addLog(ownerUid, fileName, 'share', `Shared with ${recipientEmail}`);

    return res.json({ success: true, message: 'Share created', shareId: shareRef.id, token });
  } catch (err) {
    console.error('Create share error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create share' });
  }
});

// GET /api/shares/sharedByMe - shares created by the current user
router.get('/sharedByMe', requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user.uid;
    const snap = await firestore.collection('shares').where('ownerUid', '==', ownerUid).get();
    const results = await Promise.all(snap.docs.map(async d => {
      const data = d.data();
      let fileName = '';
      let deleted = false;
      try {
        const docSnap = await firestore.collection('documents').doc(data.documentId).get();
        if (docSnap.exists) {
          const dd = docSnap.data();
          fileName = dd.fileName || '';
          deleted = dd.status === 'deleted';
        }
      } catch (e) { /* ignore */ }
      return {
        id: d.id,
        fileName,
        recipientEmail: data.recipientEmail || '',
        permission: data.permission || '',
        expiryTime: data.expiryTime || null,
        revoked: !!data.revoked,
        deleted: !!deleted,
        createdOn: data.createdOn || null
      };
    }));
    return res.json(results);
  } catch (err) {
    console.error('sharedByMe error:', err);
    return res.status(500).json({ error: 'Failed to load shares' });
  }
});

// GET /api/shares/sharedWithMe - shares where current user's email is the recipient
router.get('/sharedWithMe', requireAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) return res.status(400).json({ error: 'No email on user token' });
    const snap = await firestore.collection('shares').where('recipientEmail', '==', userEmail).get();
    const results = await Promise.all(snap.docs.map(async d => {
      const data = d.data();
      let fileName = '';
      let deleted = false;
      let sharedByEmail = '';
      try {
        const docSnap = await firestore.collection('documents').doc(data.documentId).get();
        if (docSnap.exists) {
          const dd = docSnap.data();
          fileName = dd.fileName || '';
          deleted = dd.status === 'deleted';
        }
      } catch (e) { }
      try {
        // attempt to get owner email from users collection (if present)
        const userSnap = await firestore.collection('users').doc(data.ownerUid).get();
        if (userSnap.exists) sharedByEmail = userSnap.data().email || data.ownerUid || '';
        else sharedByEmail = data.ownerUid || '';
      } catch (e) { sharedByEmail = data.ownerUid || ''; }

      return {
        id: d.id,
        fileName,
        sharedByEmail,
        permission: data.permission || '',
        expiryTime: data.expiryTime || null,
        revoked: !!data.revoked,
        deleted: !!deleted,
        token: data.token || null,
        createdOn: data.createdOn || null
      };
    }));
    return res.json(results);
  } catch (err) {
    console.error('sharedWithMe error:', err);
    return res.status(500).json({ error: 'Failed to load shares' });
  }
});

// GET /api/shares/list
router.get('/list', requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user.uid;
  const snap = await firestore.collection('shares').where('ownerUid', '==', ownerUid).get();
    const results = await Promise.all(snap.docs.map(async d => {
      const data = d.data();
      let fileName = '';
      try {
        const docSnap = await firestore.collection('documents').doc(data.documentId).get();
        fileName = docSnap.exists ? (docSnap.data().fileName || '') : '';
      } catch (e) { fileName = ''; }
      return {
        id: d.id,
        fileName,
        recipientEmail: data.recipientEmail,
        permission: data.permission,
        expiryTime: data.expiryTime || null,
        revoked: !!data.revoked,
        createdOn: data.createdOn || null
      };
    }));
    return res.json(results);
  } catch (err) {
    console.error('Shares list error:', err);
    return res.status(500).json({ error: 'Failed to list shares' });
  }
});

// POST /api/shares/revoke/:shareId
router.post('/revoke/:shareId', requireAuth, async (req, res) => {
  try {
    const ownerUid = req.user.uid;
    const shareId = req.params.shareId;
    const shareRef = firestore.collection('shares').doc(shareId);
    const snap = await shareRef.get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Share not found' });
    const data = snap.data();
    if (data.ownerUid !== ownerUid) return res.status(403).json({ success: false, message: 'Forbidden' });

    await shareRef.update({ revoked: true, revokedOn: new Date().toISOString() });

    // log revoke
    let fileName = '';
    try { const docSnap = await firestore.collection('documents').doc(data.documentId).get(); fileName = docSnap.exists ? docSnap.data().fileName : ''; } catch(e) {}
    await addLog(ownerUid, fileName, 'revoke', `Access revoked for ${data.recipientEmail}`);

    return res.json({ success: true, message: 'Share revoked successfully' });
  } catch (err) {
    console.error('Revoke error:', err);
    return res.status(500).json({ success: false, message: 'Failed to revoke share' });
  }
});

// GET /api/shares/view/:token  (public token-based access)
// Helper: validate share token and return combined data
async function findShareByToken(token) {
  const snap = await firestore.collection('shares').where('token', '==', token).limit(1).get();
  if (snap.empty) return null;
  const shareDoc = snap.docs[0];
  const data = shareDoc.data();
  return { id: shareDoc.id, ...data };
}

// GET /api/shares/view/:token -> returns JSON { success, fileUrl } or { success:false, reason }
router.get('/view/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const share = await findShareByToken(token);
    if (!share) return res.json({ success: false, reason: 'invalid' });
    if (share.revoked) return res.json({ success: false, reason: 'revoked' });
    if (share.expiryTime && new Date(share.expiryTime) < new Date()) return res.json({ success: false, reason: 'expired' });

    // check document exists and not deleted
    const docSnap = await firestore.collection('documents').doc(share.documentId).get();
    if (!docSnap.exists) return res.json({ success: false, reason: 'deleted' });
    const doc = docSnap.data();
    if (doc.status === 'deleted') return res.json({ success: false, reason: 'deleted' });

    // Log view event (non-blocking)
    addLog(share.ownerUid, doc.fileName || '', 'view', `Viewed via share token by ${share.recipientEmail || 'anonymous'}`);

    // Return a URL that can be opened for inline viewing
    const fileUrl = `/api/shares/serve/${encodeURIComponent(token)}`;
    return res.json({ success: true, fileUrl });
  } catch (err) {
    console.error('Share view (json) error:', err);
    return res.status(500).json({ success: false, reason: 'server_error' });
  }
});

// GET /api/shares/serve/:token -> streams the file (inline)
router.get('/serve/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const share = await findShareByToken(token);
    if (!share || share.revoked) return res.status(403).send('Forbidden');
    if (share.expiryTime && new Date(share.expiryTime) < new Date()) return res.status(403).send('Expired');

    const docSnap = await firestore.collection('documents').doc(share.documentId).get();
    if (!docSnap.exists) return res.status(404).send('Document not found');
    const doc = docSnap.data();
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadsDir, doc.localFilename || '');
    if (!fs.existsSync(filePath)) return res.status(404).send('File missing');

    res.setHeader('Content-Type', doc.fileType || 'application/octet-stream');
    return res.sendFile(filePath);
  } catch (err) {
    console.error('Serve share error:', err);
    return res.status(500).send('Failed to serve file');
  }
});

// GET /api/shares/download/:token -> download if permission allows
router.get('/download/:token', async (req, res) => {
  try {
    const token = req.params.token;
    const share = await findShareByToken(token);
    if (!share) return res.status(404).send('Invalid token');
    if (share.revoked) return res.status(403).send('Share revoked');
    if (share.expiryTime && new Date(share.expiryTime) < new Date()) return res.status(403).send('Share expired');

    if (share.permission === 'view' || share.permission === 'view-only') return res.status(403).send('Download not allowed');

    const docSnap = await firestore.collection('documents').doc(share.documentId).get();
    if (!docSnap.exists) return res.status(404).send('Document not found');
    const doc = docSnap.data();
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const filePath = path.join(uploadsDir, doc.localFilename || '');
    if (!fs.existsSync(filePath)) return res.status(404).send('File missing');

    // Log download event
    await addLog(share.ownerUid, doc.fileName || '', 'download', `Downloaded via share token by ${share.recipientEmail || 'anonymous'}`);

    res.setHeader('Content-Type', doc.fileType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${doc.fileName || 'file'}"`);
    return res.sendFile(filePath);
  } catch (err) {
    console.error('Download share error:', err);
    return res.status(500).send('Failed to download file');
  }
});

module.exports = router;
