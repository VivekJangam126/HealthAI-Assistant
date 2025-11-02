/**
 * routes/logs.js
 * Provides endpoints to fetch activity logs:
 *  - GET /api/logs/my      -> logs where userUid == req.user.uid
 *  - GET /api/logs/related -> logs involving req.user.email
 */
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { firestore } = require('../config/firebase');

const router = express.Router();

// POST /api/logs/view -> record a view action
router.post('/view', requireAuth, async (req, res) => {
  try {
    const { fileId, viewerEmail, viewedAt } = req.body || {};
    if (!fileId) return res.status(400).json({ success: false, message: 'fileId required' });
    const userUid = req.user.uid;
    const ts = viewedAt || new Date().toISOString();
    await firestore.collection('logs').add({
      userUid,
      actor: viewerEmail || req.user.email || null,
      fileId,
      fileName: null,
      action: 'view',
      details: `Viewed by ${viewerEmail || req.user.email || 'unknown'}`,
      timestamp: ts
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('POST /api/logs/view error', err);
    return res.status(500).json({ success: false, message: 'Failed to record view' });
  }
});

// Helper: map Firestore doc to client-friendly shape
function mapLogDoc(d) {
  const data = d.data();
  return {
    id: d.id,
    userUid: data.userUid || null,
    actor: data.actor || null,
    recipient: data.recipient || data.recipientEmail || null,
    fileName: data.fileName || null,
    action: data.action || null,
    details: data.details || '',
    timestamp: data.timestamp || null
  };
}

// GET /api/logs/my
router.get('/my', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const snap = await firestore.collection('logs').where('userUid', '==', uid).get();
    const logs = snap.docs.map(mapLogDoc);
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.json(logs);
  } catch (err) {
    console.error('Error fetching my logs:', err);
    return res.status(500).json({ message: 'Error fetching logs' });
  }
});

// GET /api/logs/related
router.get('/related', requireAuth, async (req, res) => {
  try {
    const userEmail = req.user.email;
    if (!userEmail) return res.status(400).json({ message: 'User email missing' });

    // Fetch all logs and filter server-side for involvement (small scale assumption)
    const snap = await firestore.collection('logs').get();
    const logs = snap.docs
      .map(mapLogDoc)
      .filter(l => {
        const inRecipient = l.recipient && String(l.recipient).toLowerCase() === String(userEmail).toLowerCase();
        const inDetails = l.details && String(l.details).toLowerCase().includes(String(userEmail).toLowerCase());
        const actorIsUser = l.actor && String(l.actor).toLowerCase() === String(userEmail).toLowerCase();
        return inRecipient || inDetails || actorIsUser;
      });

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return res.json(logs);
  } catch (err) {
    console.error('Error fetching related logs:', err);
    return res.status(500).json({ message: 'Error fetching related logs' });
  }
});

// Optional admin route: GET /api/logs/all
router.get('/all', requireAuth, async (req, res) => {
  try {
    // naive admin check (improve in production)
    if (!req.user || !req.user.email || !String(req.user.email).endsWith('@example.com')) return res.status(403).json({ message: 'Forbidden' });
    const snap = await firestore.collection('logs').get();
    const logs = snap.docs.map(mapLogDoc).sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));
    return res.json(logs);
  } catch (err) {
    console.error('Error fetching all logs:', err);
    return res.status(500).json({ message: 'Error' });
  }
});

module.exports = router;
