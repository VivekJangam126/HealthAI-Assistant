/**
 * Auth routes: register, login, logout
 * Uses Firebase Admin SDK for user creation and Firestore writes.
 * Uses Firebase Auth REST API to verify email/password for login (requires FIREBASE_API_KEY).
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const { auth: adminAuth, firestore } = require('../config/firebase');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';
const JWT_EXPIRES_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper to set cookie and return JSON redirect
function setSessionAndRespond(res, payload) {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('dsms_token', token, {
    httpOnly: true,
    secure: false, // set true if using HTTPS in production
    maxAge: JWT_EXPIRES_MS,
    sameSite: 'lax'
  });
  return res.json({ success: true, redirect: '/HTML/dashboard.html' });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (!fullName || !email || !password) return res.status(400).json({ error: 'fullName, email and password are required' });

    // Create user in Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email,
      password: password,
      displayName: fullName
    });

    const uid = userRecord.uid;

    // Save basic profile in Firestore under /users/{uid}
    await firestore.collection('users').doc(uid).set({
      fullName,
      email,
      uid,
      joinedOn: new Date().toISOString()
    });

    // Create session token and respond
    return setSessionAndRespond(res, { uid, email, fullName });
  } catch (err) {
    // Handle common Firebase errors
    console.error('Register error:', err);
    const message = err?.errorInfo?.message || err?.message || 'Registration failed';
    return res.status(400).json({ error: message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password are required' });

    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'FIREBASE_API_KEY not configured on server' });

    // Use Firebase Auth REST API to verify email + password
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const data = await resp.json();
    if (!resp.ok) {
      // map some error messages
      const errMsg = data?.error?.message || 'Login failed';
      return res.status(401).json({ error: errMsg });
    }

    const uid = data.localId;
    const fullName = data.displayName || (await adminAuth.getUser(uid).then(u => u.displayName).catch(()=>null));

    // Ensure user exists in Firestore; create minimal record if missing
    const userDoc = firestore.collection('users').doc(uid);
    const snap = await userDoc.get();
    if (!snap.exists) {
      await userDoc.set({ fullName: fullName || '', email, uid, joinedOn: new Date().toISOString() });
    }

    // Create session token and respond
    return setSessionAndRespond(res, { uid, email, fullName });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/logout
router.get('/logout', (req, res) => {
  // Clear cookie
  res.clearCookie('dsms_token');
  // If the request expects HTML, redirect; otherwise send JSON so fetch() handlers can read
  if (req.accepts('html')) return res.redirect('/HTML/auth.html');
  return res.json({ success: true, redirect: '/HTML/auth.html' });
});

module.exports = router;
