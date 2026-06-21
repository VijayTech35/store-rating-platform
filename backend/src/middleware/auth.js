const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/auth');
const { pool } = require('../config/database');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { rows } = await pool.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [decoded.id]);
    if (!rows[0]) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }
    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
