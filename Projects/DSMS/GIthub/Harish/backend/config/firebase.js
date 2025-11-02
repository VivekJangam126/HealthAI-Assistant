/**
 * Firebase Admin initialization
 * Exports: admin, auth, firestore
 * Expects a service account JSON file path at process.env.GOOGLE_APPLICATION_CREDENTIALS
 * or a file named `serviceAccountKey.json` in this backend folder.
 */
const path = require('path');
const admin = require('firebase-admin');

// Try to load service account JSON from environment path or local file
let serviceAccount;
const envPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (envPath) {
  serviceAccount = require(path.resolve(envPath));
} else {
  // fallback: look for serviceAccountKey.json in backend folder
  try {
    serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
  } catch (err) {
    console.error('Firebase service account not found. Set GOOGLE_APPLICATION_CREDENTIALS or place serviceAccountKey.json in backend/.');
    // rethrow so init fails loudly when used
    throw err;
  }
}

// Initialize admin app (idempotent)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const auth = admin.auth();
const firestore = admin.firestore();

module.exports = { admin, auth, firestore };
