const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const db = require('../config/database');

const router = express.Router();

router.get('/owner', authenticate, authorize('store_owner'), (req, res, next) => {
  try {
    const store = db.prepare(
      'SELECT id, name, email, address FROM stores WHERE owner_id = ?'
    ).get(req.user.id);

    if (!store) {
      return res.json({ store: null, ratings: [], avgRating: 0 });
    }

    const ratings = Rating.findByStore(store.id);
    const avgRating = Rating.getAverageRating(store.id);

    res.json({ store, ratings, avgRating });
  } catch (err) {
    next(err);
  }
});

router.put('/owner/store', authenticate, authorize('store_owner'), (req, res, next) => {
  try {
    const store = db.prepare('SELECT id FROM stores WHERE owner_id = ?').get(req.user.id);
    if (!store) return res.status(404).json({ message: 'No store assigned to you.' });
    const updated = Store.update(store.id, req.body);
    res.json({ store: updated });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
