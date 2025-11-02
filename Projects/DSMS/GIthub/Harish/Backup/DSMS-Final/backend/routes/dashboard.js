/**
 * Dashboard routes - provides a summary for the logged-in user
 */
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { firestore } = require('../config/firebase');

const router = express.Router();

// GET /api/dashboard/summary
router.get('/summary', requireAuth, async (req, res) => {
  try {
    const uid = req.user?.uid;
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

    // Fetch user profile
    const userDoc = await firestore.collection('users').doc(uid).get();
    const userData = userDoc.exists ? userDoc.data() : { fullName: '', email: req.user.email || '', joinedOn: '' };

    // Fetch documents owned by user
    const docsSnap = await firestore.collection('documents').where('ownerUid', '==', uid).get();

    // Fetch shares owned by user
    const sharesSnap = await firestore.collection('shares').where('ownerUid', '==', uid).get();

    // Recent logs for user (limit 5)
    let logsQuery = firestore.collection('logs').where('userUid', '==', uid).orderBy('timestamp', 'desc').limit(5);
    const logsSnap = await logsQuery.get();

    // Recent notifications for user (limit 5)
    let notifQuery = firestore.collection('notifications').where('userUid', '==', uid).orderBy('timestamp', 'desc').limit(5);
    const notifSnap = await notifQuery.get();

    const totalDocs = docsSnap.size;
    const totalShares = sharesSnap.size;
    // Compute storageUsed by summing fileSize (assumed stored in bytes) or 0
    const storageUsed = docsSnap.docs.reduce((acc, d) => {
      const s = d.data()?.fileSize || d.data()?.size || 0;
      return acc + (typeof s === 'number' ? s : Number(s) || 0);
    }, 0);

    const recentLogs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    const notifications = notifSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.json({
      user: {
        fullName: userData.fullName || req.user.fullName || '',
        email: userData.email || req.user.email || '',
        joinedOn: userData.joinedOn || ''
      },
      stats: {
        totalDocs,
        totalShares,
        storageUsed
      },
      recentLogs,
      notifications
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    return res.status(500).json({ error: 'Failed to load dashboard summary' });
  }
});

module.exports = router;
