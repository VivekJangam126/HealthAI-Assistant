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
    const userEmail = req.user?.email || '';
    if (!uid) return res.status(401).json({ error: 'Unauthorized' });

  // Time window: adjustable via ?weeks= query param (default 8, min 1, max 52)
  const now = new Date();
  const rawWeeks = parseInt(req.query.weeks, 10);
  const weeks = (Number.isInteger(rawWeeks) && rawWeeks >= 1 && rawWeeks <= 52) ? rawWeeks : 8;
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const oldest = new Date(now.getTime() - (weeks - 1) * msPerWeek);
    const oldestIso = oldest.toISOString();

    // Fetch documents owned by user (only recent ones within timeframe for chart grouping)
    const docsSnapRecent = await firestore.collection('documents')
      .where('ownerUid', '==', uid)
      .where('uploadDate', '>=', oldestIso)
      .get();

    // Also fetch all documents for count/storage (exclude deleted)
    const docsSnapAll = await firestore.collection('documents').where('ownerUid', '==', uid).get();

    // Fetch shares owned by user (recent for charting)
    const sharesSnapRecent = await firestore.collection('shares')
      .where('ownerUid', '==', uid)
      .where('createdOn', '>=', oldestIso)
      .get();

    // Fetch all shares owned by user for active count
    const sharesSnapAll = await firestore.collection('shares').where('ownerUid', '==', uid).get();

    // Recent logs for user (limit 5)
    const logsSnap = await firestore.collection('logs')
      .where('userUid', '==', uid)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    // Count total documents (exclude deleted)
    const totalDocuments = docsSnapAll.docs.reduce((acc, d) => {
      const st = d.data()?.status || 'active';
      return st === 'deleted' ? acc : acc + 1;
    }, 0);

    // Sum storage used (bytes) across active docs
    const storageBytes = docsSnapAll.docs.reduce((acc, d) => {
      const st = d.data()?.status || 'active';
      if (st === 'deleted') return acc;
      const s = d.data()?.fileSize || d.data()?.size || 0;
      return acc + (typeof s === 'number' ? s : Number(s) || 0);
    }, 0);

    const storageUsedMB = Number((storageBytes / (1024 * 1024)).toFixed(2));

    // Active shares: revoked == false and (no expiry or expiryTime > now)
    const nowIso = new Date().toISOString();
    let activeShares = 0;
    for (const d of sharesSnapAll.docs) {
      const data = d.data();
      const revoked = !!data.revoked;
      const expiryTime = data.expiryTime || null;
      if (revoked) continue;
      if (!expiryTime) { activeShares++; continue; }
      if (new Date(expiryTime) > new Date(nowIso)) activeShares++;
    }

    // Recent activities from logs (map to required shape)
    const recentActivities = logsSnap.docs.map(d => {
      const dt = d.data();
      return {
        fileName: dt.fileName || '',
        action: dt.action || '',
        timestamp: dt.timestamp || '' ,
        details: dt.details || ''
      };
    });

    // Build weekly buckets (array of weekStart ISO strings)
    const bucketStarts = [];
    // Align oldest to start of week (Sunday)
    const start = new Date(oldest.setHours(0,0,0,0));
    // move to nearest previous Sunday
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    for (let i = 0; i < weeks; i++) {
      const wk = new Date(start.getTime() + i * msPerWeek);
      bucketStarts.push(wk.toISOString().slice(0,10)); // YYYY-MM-DD
    }

    // Helper to find bucket index
    function weekIndexForIso(iso) {
      if (!iso) return -1;
      const d = new Date(iso);
      const diff = d.getTime() - new Date(bucketStarts[0]).getTime();
      if (isNaN(diff)) return -1;
      const idx = Math.floor(diff / msPerWeek);
      if (idx < 0) return -1;
      if (idx >= weeks) return -1;
      return idx;
    }

    // Initialize arrays
    const uploadsPerWeek = new Array(weeks).fill(0);
    const sharesPerWeek = new Array(weeks).fill(0);
    const storagePerWeekBytes = new Array(weeks).fill(0);

    // Count uploads per week and storage uploaded per week
    for (const d of docsSnapRecent.docs) {
      const data = d.data();
      const idx = weekIndexForIso(data.uploadDate || data.uploadedOn || data.createdOn);
      if (idx >= 0) {
        uploadsPerWeek[idx]++;
        const s = data.fileSize || data.size || 0;
        storagePerWeekBytes[idx] += (typeof s === 'number' ? s : Number(s) || 0);
      }
    }

    // Count shares per week
    for (const sdoc of sharesSnapRecent.docs) {
      const data = sdoc.data();
      const idx = weekIndexForIso(data.createdOn || data.createdAt || data.created);
      if (idx >= 0) sharesPerWeek[idx]++;
    }

    // Build cumulative storage usage per week (MB)
    const storageUsage = [];
    let cumulative = 0;
    for (let i = 0; i < weeks; i++) {
      cumulative += storagePerWeekBytes[i];
      storageUsage.push({ week: bucketStarts[i], storageMB: Number((cumulative / (1024*1024)).toFixed(2)) });
    }

    // Format chart arrays
    const uploadsPerWeekArr = bucketStarts.map((wk, i) => ({ week: wk, count: uploadsPerWeek[i] }));
    const sharesPerWeekArr = bucketStarts.map((wk, i) => ({ week: wk, count: sharesPerWeek[i] }));

    return res.json({
      totalDocuments,
      activeShares,
      storageUsedMB,
      recentActivities,
      chartData: {
        uploadsPerWeek: uploadsPerWeekArr,
        sharesPerWeek: sharesPerWeekArr,
        storageUsage
      }
    });
  } catch (err) {
    console.error('Dashboard summary error:', err);
    return res.status(500).json({ error: 'Failed to load dashboard summary' });
  }
});

module.exports = router;
