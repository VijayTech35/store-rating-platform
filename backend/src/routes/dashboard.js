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
  let ratings = await Rating.findByStore(store.id);
  const avgRating = await Rating.getAverageRating(store.id);

  const { search, rating, sort } = req.query;

  if (search) {
    const q = search.toLowerCase();
    ratings = ratings.filter(r => r.user_name.toLowerCase().includes(q) || r.user_email.toLowerCase().includes(q));
  }

  if (rating) {
    const val = parseInt(rating, 10);
    if (val >= 1 && val <= 5) ratings = ratings.filter(r => r.rating === val);
  }

  if (sort === 'oldest') ratings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  else if (sort === 'highest') ratings.sort((a, b) => b.rating - a.rating);
  else if (sort === 'lowest') ratings.sort((a, b) => a.rating - b.rating);
  else ratings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({ store, ratings, avgRating });
});

router.put('/owner/store', authenticate, authorize('store_owner'), async (req, res) => {
  const { rows } = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);
  if (!rows[0]) return res.status(404).json({ message: 'No store assigned to you.' });
  const updated = await Store.update(rows[0].id, req.body);
  res.json({ store: updated });
});

module.exports = router;
