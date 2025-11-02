const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { auth, firestore } = require('../config/firebase');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// GET /api/settings
router.get('/', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const userSnap = await firestore.collection('users').doc(uid).get();
    const userData = userSnap.exists ? userSnap.data() : {};
    const preferences = userData.preferences || {
      emailAlerts: true,
      inAppNotifications: true,
      alwaysEncryptFiles: true,
      theme: 'light'
    };
    return res.json({ preferences });
  } catch (err) {
    console.error('GET /api/settings error', err);
    return res.status(500).json({ error: 'Failed to load settings' });
  }
});

// PATCH /api/settings/update -> merge preferences
router.patch('/update', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const { preferences } = req.body || {};
    if (!preferences || typeof preferences !== 'object') return res.status(400).json({ success: false, message: 'Invalid preferences' });
    // sanitize allowed keys
    const allowed = ['emailAlerts','inAppNotifications','alwaysEncryptFiles','theme'];
    const toSave = {};
    Object.keys(preferences).forEach(k => {
      if (allowed.includes(k)) toSave[`preferences.${k}`] = preferences[k];
    });
    if (!Object.keys(toSave).length) return res.status(400).json({ success: false, message: 'No valid preference keys' });

    await firestore.collection('users').doc(uid).set(toSave, { merge: true });
    return res.json({ success: true, preferences: preferences });
  } catch (err) {
    console.error('PATCH /api/settings/update error', err);
    return res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
});

// POST /api/settings/logoutAll -> revoke tokens and record timestamp
router.post('/logoutAll', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    // Revoke refresh tokens for user (forces sign-out on clients)
    await auth.revokeRefreshTokens(uid);
    const ts = new Date().toISOString();
    await firestore.collection('users').doc(uid).set({ lastLogoutAll: ts }, { merge: true });
    return res.json({ success: true, message: 'All sessions revoked', timestamp: ts });
  } catch (err) {
    console.error('POST /api/settings/logoutAll error', err);
    return res.status(500).json({ success: false, message: 'Failed to revoke sessions' });
  }
});

// POST /api/settings/exportData -> bundle user's data and return JSON download
router.post('/exportData', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    // Fetch documents
    const [docsSnap, sharesSnap, logsSnap, notesSnap] = await Promise.all([
      firestore.collection('documents').where('ownerUid','==',uid).get(),
      firestore.collection('shares').where('ownerUid','==',uid).get(),
      firestore.collection('logs').where('userUid','==',uid).get(),
      firestore.collection('notifications').where('userEmail','==',req.user.email).get()
    ]);

    const payload = {
      exportedAt: new Date().toISOString(),
      documents: docsSnap.docs.map(d => ({ id: d.id, ...(d.data()||{}) })),
      shares: sharesSnap.docs.map(d => ({ id: d.id, ...(d.data()||{}) })),
      logs: logsSnap.docs.map(d => ({ id: d.id, ...(d.data()||{}) })),
      notifications: notesSnap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }))
    };

    const json = JSON.stringify(payload, null, 2);
    const filename = `dsms_export_${uid}_${Date.now()}.json`;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.send(json);
  } catch (err) {
    console.error('POST /api/settings/exportData error', err);
    return res.status(500).json({ success: false, message: 'Failed to export data' });
  }
});

// DELETE /api/settings/deleteAccount -> remove user data and delete auth user
router.delete('/deleteAccount', requireAuth, async (req, res) => {
  try {
    const uid = req.user.uid;
    const email = req.user.email;

    // Delete related collections: documents, shares, logs, notifications
    // Note: Firestore doesn't support bulk deletes in one call; delete doc-by-doc
    const collections = [
      { name: 'documents', query: firestore.collection('documents').where('ownerUid','==',uid) },
      { name: 'shares', query: firestore.collection('shares').where('ownerUid','==',uid) },
      { name: 'logs', query: firestore.collection('logs').where('userUid','==',uid) },
      { name: 'notifications', query: firestore.collection('notifications').where('userEmail','==',email) }
    ];

    for (const c of collections) {
      try {
        const snap = await c.query.get();
        const batch = firestore.batch();
        snap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();
      } catch (e) { console.warn(`Failed to delete ${c.name}`, e.message || e); }
    }

    // Delete user document
    try { await firestore.collection('users').doc(uid).delete(); } catch (e) { console.warn('Failed to delete users doc', e.message || e); }

    // Delete Firebase Auth user
    try { await auth.deleteUser(uid); } catch (e) { console.warn('Failed to delete auth user', e.message || e); }

    return res.json({ success: true, message: 'Account and related data deleted' });
  } catch (err) {
    console.error('DELETE /api/settings/deleteAccount error', err);
    return res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
});

module.exports = router;
