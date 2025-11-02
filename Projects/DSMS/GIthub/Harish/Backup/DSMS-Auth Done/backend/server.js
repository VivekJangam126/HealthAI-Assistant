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

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authRouter);

// Serve static frontend files from repo's HTML folder at /HTML
app.use('/HTML', express.static(path.join(__dirname, '..', 'HTML')));
// Serve CSS and JS folders so HTML pages can reference them as /CSS/... and /JS/...
app.use('/CSS', express.static(path.join(__dirname, '..', 'CSS')));
app.use('/JS', express.static(path.join(__dirname, '..', 'JS')));

// Root health check
app.get('/', (req, res) => {
  res.send('DSMS backend running. Serve frontend at /HTML/index.html');
});

app.listen(PORT, () => {
  console.log(`DSMS backend listening on port ${PORT}`);
});
