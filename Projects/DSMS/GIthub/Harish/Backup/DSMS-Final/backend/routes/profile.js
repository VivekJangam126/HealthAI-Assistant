const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { auth, firestore } = require('../config/firebase');

const router = express.Router();

function bytesToHuman(bytes) {
  if (!bytes && bytes !== 0) return '0 B';
  const units = ['B','KB','MB','GB','TB'];
  let i = 0; let value = Number(bytes) || 0;
  while (value >= 1024 && i < units.length - 1) { value = value / 1024; i++; }
  return `${Math.round(value * 10) / 10} ${units[i]}`;
}

// GET /api/profile
router.get('/', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email || '';

    // Try to read Firestore user doc
    const userDocRef = firestore.collection('users').doc(uid);
    const userSnap = await userDocRef.get();
    const userData = userSnap.exists ? userSnap.data() : {};

    // Basic auth metadata
    let authUser = {};
    try { authUser = await auth.getUser(uid); } catch (e) { /* ignore */ }

    // Documents stats
    const docsSnap = await firestore.collection('documents').where('ownerUid', '==', uid).get();
    const docs = docsSnap.docs.map(d => d.data() || {});
    const documentsCount = docs.length;
    const storageBytes = docs.reduce((s, d) => s + (Number(d.fileSize) || 0), 0);

    // Active shares count (owner shares not revoked and not expired)
    const sharesSnap = await firestore.collection('shares').where('ownerUid', '==', uid).get();
    let activeShares = 0;
    const now = new Date();
    sharesSnap.docs.forEach(s => {
      const sd = s.data() || {};
      if (sd.revoked) return;
      if (sd.expiryTime && new Date(sd.expiryTime) < now) return;
      activeShares++;
    });

    const result = {
      name: userData.name || authUser.displayName || (req.user.fullName || ''),
      email: userData.email || email || authUser.email || '',
      uid,
      joinDate: userData.joinDate || authUser.metadata?.creationTime || null,
      lastLogin: userData.lastLogin || authUser.metadata?.lastSignInTime || null,
      encryptionStatus: userData.encryptionStatus || (userData.stats && userData.stats.encryptionStatus) || 'Unknown',
      stats: {
        documents: documentsCount,
        storageUsed: bytesToHuman(storageBytes),
        activeShares
      }
    };

    return res.json(result);
  } catch (err) {
    console.error('GET /api/profile error', err);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PATCH /api/profile/update
router.patch('/update', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { name, photoURL } = req.body || {};
    const update = {};
    if (typeof name === 'string' && name.trim()) update.name = String(name).trim().slice(0, 200);
    if (typeof photoURL === 'string' && photoURL.trim()) update.photoURL = String(photoURL).trim().slice(0, 1000);

    if (!Object.keys(update).length) return res.status(400).json({ success: false, message: 'No valid fields to update' });

    // Update Firestore user doc (merge)
    await firestore.collection('users').doc(uid).set(update, { merge: true });

    // Update Firebase Auth profile where possible
    try {
      const authUpdate = {};
      if (update.name) authUpdate.displayName = update.name;
      if (update.photoURL) authUpdate.photoURL = update.photoURL;
      if (Object.keys(authUpdate).length) await auth.updateUser(uid, authUpdate);
    } catch (e) { console.warn('Failed to update Firebase Auth user profile', e.message || e); }

    const userSnap = await firestore.collection('users').doc(uid).get();
    return res.json({ success: true, user: userSnap.exists ? userSnap.data() : update });
  } catch (err) {
    console.error('PATCH /api/profile/update error', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router;
