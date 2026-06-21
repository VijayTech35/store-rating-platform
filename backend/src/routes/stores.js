const express = require('express');
const { authenticate } = require('../middleware/auth');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { submitRatingValidation } = require('../validators/rating');
const { validationResult } = require('express-validator');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { search, sortBy, sortOrder, limit, offset } = req.query;
  const result = await Store.findAll({ search, sortBy, sortOrder, limit, offset });

  const storesWithUserRating = [];
  for (const store of result.stores) {
    let userRating = null;
    if (req.user.role === 'user') {
      const rating = await Rating.findByUserAndStore(req.user.id, store.id);
      userRating = rating ? rating.rating : null;
    }
    storesWithUserRating.push({ ...store, userRating });
  }

  res.json({ stores: storesWithUserRating, total: result.total });
});

router.get('/:id', authenticate, async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).json({ message: 'Store not found.' });

  let userRating = null;
  if (req.user.role === 'user') {
    const rating = await Rating.findByUserAndStore(req.user.id, store.id);
    userRating = rating ? rating.rating : null;
  }

  res.json({ store: { ...store, userRating } });
});

router.post('/:id/rate', authenticate, submitRatingValidation, async (req, res) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only normal users can submit ratings.' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).json({ message: 'Store not found.' });

  const rating = await Rating.upsert({
    user_id: req.user.id,
    store_id: parseInt(req.params.id, 10),
    rating: req.body.rating,
  });

  res.json({ rating });
});

module.exports = router;
