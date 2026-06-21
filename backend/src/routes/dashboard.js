const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { pool } = require('../config/database');

const router = express.Router();

router.get('/owner', authenticate, authorize('store_owner'), async (req, res) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, address FROM stores WHERE owner_id = $1',
    [req.user.id]
  );

  if (!rows[0]) {
    return res.json({ store: null, ratings: [], avgRating: 0 });
  }

  const store = rows[0];
  const [ratings, avgRating] = await Promise.all([
    Rating.findByStore(store.id),
    Rating.getAverageRating(store.id),
  ]);

  res.json({ store, ratings, avgRating });
});

router.put('/owner/store', authenticate, authorize('store_owner'), async (req, res) => {
  const { rows } = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);
  if (!rows[0]) return res.status(404).json({ message: 'No store assigned to you.' });
  const updated = await Store.update(rows[0].id, req.body);
  res.json({ store: updated });
});

module.exports = router;
