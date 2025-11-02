/**
 * notifications.js
 * Provides notification endpoints and helper to write notifications to Firestore.
 */
const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { firestore } = require('../config/firebase');

const router = express.Router();

// Helper: send a notification to a user's email
async function sendNotification(userEmail, type, message, fileName = '', senderEmail = '') {
  if (!userEmail) return;
  try {
    await firestore.collection('notifications').add({
      userEmail: String(userEmail).toLowerCase(),
      senderEmail: senderEmail || null,
      type: type || 'info',
      message: message || '',
      fileName: fileName || null,
      timestamp: new Date().toISOString(),
      isRead: false
    });
  } catch (err) {
    console.error('Failed to send notification:', err);
  }
}

// GET /api/notifications?unreadOnly=true
router.get('/', requireAuth, async (req, res) => {
  try {
    const email = String(req.user.email || '').toLowerCase();
    const unreadOnly = String(req.query.unreadOnly || '').toLowerCase() === 'true';

    // Build query (avoid orderBy to prevent Firestore composite index errors).
    let q = firestore.collection('notifications').where('userEmail', '==', email);
    if (unreadOnly) q = q.where('isRead', '==', false);

    const snap = await q.get();
    let notifications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    // Sort server-side by timestamp (newest first). Timestamp stored as ISO string.
    notifications.sort((a, b) => {
      const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
      const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
      return tb - ta;
    });
    return res.json({ success: true, notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/notifications/unreadCount
router.get('/unreadCount', requireAuth, async (req, res) => {
  try {
    const email = String(req.user.email || '').toLowerCase();
    const snap = await firestore.collection('notifications').where('userEmail', '==', email).where('isRead', '==', false).get();
    return res.json({ success: true, count: snap.size });
  } catch (err) {
    console.error('Error fetching unread count:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const docRef = firestore.collection('notifications').doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ success: false, message: 'Notification not found' });
    const data = snap.data();
    if (String(data.userEmail).toLowerCase() !== String(req.user.email).toLowerCase()) return res.status(403).json({ success: false, message: 'Forbidden' });
    await docRef.update({ isRead: true, readOn: new Date().toISOString() });
    return res.json({ success: true });
  } catch (err) {
    console.error('Error marking notification read:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/notifications/markAllRead
router.post('/markAllRead', requireAuth, async (req, res) => {
  try {
    const email = String(req.user.email || '').toLowerCase();
    const snap = await firestore.collection('notifications').where('userEmail', '==', email).where('isRead', '==', false).get();
    const batch = firestore.batch();
    snap.docs.forEach(d => batch.update(d.ref, { isRead: true, readOn: new Date().toISOString() }));
    await batch.commit();
    return res.json({ success: true });
  } catch (err) {
    console.error('Error marking all notifications read:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
module.exports.sendNotification = sendNotification;
