const express = require('express');
const { authenticate } = require('../middleware/auth');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { submitRatingValidation } = require('../validators/rating');
const { validationResult } = require('express-validator');

const router = express.Router();

router.get('/', authenticate, (req, res, next) => {
  try {
    const { search, sortBy, sortOrder, limit, offset } = req.query;
    const result = Store.findAll({ search, sortBy, sortOrder, limit, offset });

    const storesWithUserRating = result.stores.map((store) => {
      let userRating = null;
      if (req.user.role === 'user') {
        const rating = Rating.findByUserAndStore(req.user.id, store.id);
        userRating = rating ? rating.rating : null;
      }
      return { ...store, userRating };
    });

    res.json({ stores: storesWithUserRating, total: result.total });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authenticate, (req, res, next) => {
  try {
    const store = Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    let userRating = null;
    if (req.user.role === 'user') {
      const rating = Rating.findByUserAndStore(req.user.id, store.id);
      userRating = rating ? rating.rating : null;
    }

    res.json({ store: { ...store, userRating } });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/rate', authenticate, submitRatingValidation, (req, res, next) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only normal users can submit ratings.' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const store = Store.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Store not found.' });
    }

    const rating = Rating.upsert({
      user_id: req.user.id,
      store_id: parseInt(req.params.id, 10),
      rating: req.body.rating,
    });

    res.json({ rating });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
