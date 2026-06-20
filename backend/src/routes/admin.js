const express = require('express');
const { validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const db = require('../config/database');
const { signupValidation } = require('../validators/auth');
const { createStoreValidation } = require('../validators/store');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', (req, res, next) => {
  try {
    const totalUsers = User.getCount();
    const totalStores = Store.getCount();
    const totalRatings = Rating.getCount();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
});

router.get('/users', (req, res, next) => {
  try {
    const { search, role, sortBy, sortOrder, limit, offset } = req.query;
    const result = User.findAll({ search, role, sortBy, sortOrder, limit, offset });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:id', (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    let rating = null;
    if (user.role === 'store_owner') {
      const ownerStore = db.prepare('SELECT id FROM stores WHERE owner_id = ?').get(user.id);
      if (ownerStore) {
        rating = Rating.getAverageRating(ownerStore.id);
      }
    }

    res.json({ user, rating });
  } catch (err) {
    next(err);
  }
});

router.post('/users', signupValidation, (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const existing = User.findByEmail(req.body.email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const user = User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      role: req.body.role || 'user',
    });

    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id', (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (req.body.email && req.body.email !== user.email) {
      const existing = User.findByEmail(req.body.email);
      if (existing) return res.status(409).json({ message: 'Email already in use.' });
    }

    const updated = User.update(req.params.id, req.body);
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/users/:id', (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    User.delete(req.params.id);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

router.put('/users/:id/password', (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    const { password } = req.body;
    if (!password || password.length < 8 || password.length > 16) {
      return res.status(400).json({ message: 'Password must be 8-16 characters.' });
    }
    if (!/[A-Z]/.test(password)) return res.status(400).json({ message: 'Password must contain 1 uppercase letter.' });
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return res.status(400).json({ message: 'Password must contain 1 special character.' });
    User.updatePassword(req.params.id, password);
    res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    next(err);
  }
});

router.get('/stores', (req, res, next) => {
  try {
    const { search, sortBy, sortOrder, limit, offset } = req.query;
    const result = Store.findAll({ search, sortBy, sortOrder, limit, offset });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

router.get('/stores/:id', (req, res, next) => {
  try {
    const store = Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });
    const avg = Rating.getAverageRating(store.id);
    const ratings = db.prepare('SELECT r.id, r.rating, r.created_at, u.name, u.email FROM ratings r JOIN users u ON u.id = r.user_id WHERE r.store_id = ? ORDER BY r.created_at DESC').all(store.id);
    res.json({ store, avg_rating: avg, ratings });
  } catch (err) {
    next(err);
  }
});

router.post('/stores', createStoreValidation, (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const owner = User.findById(req.body.owner_id);
    if (!owner || owner.role !== 'store_owner') {
      return res.status(400).json({ message: 'Owner must be a valid store owner.' });
    }

    const store = Store.create(req.body);
    res.status(201).json({ store });
  } catch (err) {
    next(err);
  }
});

router.put('/stores/:id', (req, res, next) => {
  try {
    const store = Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });
    const updated = Store.update(req.params.id, req.body);
    res.json({ store: updated });
  } catch (err) {
    next(err);
  }
});

router.delete('/stores/:id', (req, res, next) => {
  try {
    const store = Store.findById(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found.' });
    Store.delete(req.params.id);
    res.json({ message: 'Store deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

router.delete('/ratings/:id', (req, res, next) => {
  try {
    const existing = db.prepare('SELECT id FROM ratings WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Rating not found.' });
    Rating.delete(req.params.id);
    res.json({ message: 'Rating deleted successfully.' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
