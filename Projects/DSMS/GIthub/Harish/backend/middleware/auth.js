/**
 * JWT auth middleware - verifies `dsms_token` cookie and attaches user to req
 */
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_strong_secret';

function requireAuth(req, res, next) {
  const token = req.cookies?.dsms_token || null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { uid, email, fullName }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { requireAuth };
