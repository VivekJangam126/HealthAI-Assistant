/**
 * Main Express server for DSMS backend
 * Serves static files under /HTML and exposes /api/auth routes
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Initialize Firebase - this will throw an error if service account is missing
const { admin } = require('./config/firebase');

const authRouter = require('./routes/auth');
const dashboardRouter = require('./routes/dashboard');
const documentsRouter = require('./routes/documents');
const sharesRouter = require('./routes/shares');
const logsRouter = require('./routes/logs');
const notificationsRouter = require('./routes/notifications');
const requestsRouter = require('./routes/requests');
const profileRouter = require('./routes/profile');
const settingsRouter = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/shares', sharesRouter);
app.use('/api/logs', logsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/requests', requestsRouter);

// Serve static frontend files from repo's HTML folder at /HTML
app.use('/HTML', express.static(path.join(__dirname, '..', 'HTML')));
// Serve CSS and JS folders so HTML pages can reference them as /CSS/... and /JS/...
app.use('/CSS', express.static(path.join(__dirname, '..', 'CSS')));
app.use('/JS', express.static(path.join(__dirname, '..', 'JS')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Root health check
app.get('/', (req, res) => {
  res.send('DSMS backend running. Serve frontend at /HTML/index.html');
});

app.listen(PORT, () => {
  console.log(`DSMS backend listening on port ${PORT}`);
});

// Background expiry scanner: mark shares expired past expiryTime as revoked and log them
const { firestore } = require('./config/firebase');
(async function runExpiryScanner() {
  async function scanOnce() {
    try {
      const nowIso = new Date().toISOString();
      const snap = await firestore.collection('shares').where('expiryTime', '<', nowIso).where('revoked', '==', false).get();
      if (snap.empty) return;
      console.log(`Expiry scanner: found ${snap.size} expired shares to revoke`);
      const batch = firestore.batch();
      for (const doc of snap.docs) {
        const ref = doc.ref;
        batch.update(ref, { revoked: true, autoRevokedOn: new Date().toISOString() });
        try {
          await firestore.collection('logs').add({ userUid: doc.data().ownerUid || null, action: 'auto-revoked', fileName: '', details: `Auto-revoked share ${doc.id}`, timestamp: new Date().toISOString() });
        } catch (e) { console.warn('Failed to write auto-revoke log', e); }
      }
      await batch.commit();
    } catch (e) { console.error('Expiry scanner failed', e); }
  }

  // Run immediately, then every 5 minutes
  await scanOnce();
  setInterval(scanOnce, 5 * 60 * 1000);
})();
