const express = require('express');
const crypto = require('crypto');
const { requireAuth } = require('../middleware/auth');
const { firestore } = require('../config/firebase');

const router = express.Router();

// POST /api/requests/create
router.post('/create', requireAuth, async (req, res) => {
  try {
    const { requesterEmail, recipientEmail, docType, reason, expiry } = req.body || {};
    if (!requesterEmail || !recipientEmail || !docType) return res.status(400).json({ success: false, message: 'Missing fields' });
    const now = new Date().toISOString();
    const requestDoc = {
      requesterEmail,
      recipientEmail,
      docType,
      reason: reason || '',
      expiry: expiry || null,
      createdAt: now,
      status: 'pending'
    };
    const ref = await firestore.collection('requests').add(requestDoc);
    // log
    try { await firestore.collection('logs').add({ userUid: req.user.uid, action: 'request:create', details: `Request ${ref.id} created`, timestamp: now }); } catch (e) {}
    return res.json({ success: true, id: ref.id });
  } catch (err) {
    console.error('Create request error', err);
    return res.status(500).json({ success: false, message: 'Failed to create request' });
  }
});

// GET /api/requests/received
router.get('/received', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const snap = await firestore.collection('requests').where('recipientEmail', '==', email).get();
    const list = snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
    return res.json(list);
  } catch (err) {
    console.error('Get received requests error', err);
    return res.status(500).json({ success: false, message: 'Failed to load received requests' });
  }
});

// GET /api/requests/sent
router.get('/sent', requireAuth, async (req, res) => {
  try {
    const email = req.user.email;
    const snap = await firestore.collection('requests').where('requesterEmail', '==', email).get();
    const list = snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
    return res.json(list);
  } catch (err) {
    console.error('Get sent requests error', err);
    return res.status(500).json({ success: false, message: 'Failed to load sent requests' });
  }
});

// PATCH /api/requests/accept/:id
router.patch('/accept/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const reqRef = firestore.collection('requests').doc(id);
    const snap = await reqRef.get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Request not found' });
    const data = snap.data();
    if (data.recipientEmail !== req.user.email) return res.status(403).json({ success: false, message: 'Forbidden' });

    // create a share entry (view permission by default)
    const token = crypto.randomBytes(16).toString('hex');
    const expiryTime = data.expiry || null;
    const shareDoc = {
      ownerUid: data.requesterUid || null,
      documentId: data.documentId || null,
      recipientEmail: data.requesterEmail,
      permission: 'view',
      expiryTime: expiryTime,
      token,
      revoked: false,
      createdOn: new Date().toISOString()
    };

    // If request referenced a specific document by id, include it; otherwise, docType was requested and owner may select doc manually (we still create a share if documentId present)
    const shareRef = await firestore.collection('shares').add(shareDoc);

    // mark request accepted
    await reqRef.update({ status: 'accepted', acceptedOn: new Date().toISOString(), shareId: shareRef.id });

    // log
    try { await firestore.collection('logs').add({ userUid: req.user.uid, action: 'request:accept', details: `Accepted request ${id} -> share ${shareRef.id}`, timestamp: new Date().toISOString() }); } catch (e) {}

    return res.json({ success: true, shareId: shareRef.id });
  } catch (err) {
    console.error('Accept request error', err);
    return res.status(500).json({ success: false, message: 'Failed to accept request' });
  }
});

// PATCH /api/requests/deny/:id
router.patch('/deny/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const reqRef = firestore.collection('requests').doc(id);
    const snap = await reqRef.get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Request not found' });
    const data = snap.data();
    if (data.recipientEmail !== req.user.email) return res.status(403).json({ success: false, message: 'Forbidden' });
    await reqRef.update({ status: 'denied', deniedOn: new Date().toISOString() });
    try { await firestore.collection('logs').add({ userUid: req.user.uid, action: 'request:deny', details: `Denied request ${id}`, timestamp: new Date().toISOString() }); } catch (e) {}
    return res.json({ success: true });
  } catch (err) {
    console.error('Deny request error', err);
    return res.status(500).json({ success: false, message: 'Failed to deny request' });
  }
});

module.exports = router;
