const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const { pool } = require('../config/database');
const { signupValidation } = require('../validators/auth');
const { createStoreValidation } = require('../validators/store');

const router = express.Router();

router.use(authenticate, authorize('admin'));

router.get('/dashboard', async (req, res) => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    User.getCount(), Store.getCount(), Rating.getCount(),
  ]);
  res.json({ totalUsers, totalStores, totalRatings });
});

router.get('/users', async (req, res) => {
  const { search, sortBy, sortOrder, limit, offset } = req.query;
  let { role } = req.query;
  if (!role) role = ['admin', 'user'];
  const result = await User.findAll({ search, role, sortBy, sortOrder, limit, offset });
  res.json(result);
});

router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  let rating = null;
  if (user.role === 'store_owner') {
    const { rows } = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [user.id]);
    if (rows[0]) {
      rating = await Rating.getAverageRating(rows[0].id);
    }
  }

  res.json({ user, rating: rating !== null ? { avg: rating } : null });
});

router.post('/users', signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const existing = await User.findByEmail(req.body.email);
  if (existing) return res.status(409).json({ message: 'Email already registered.' });

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    role: req.body.role || 'user',
  });

  res.status(201).json({ user });
});

router.put('/users/:id', async (req, res) => {
  const { name, email, address, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (email && email !== user.email) {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already in use.' });
  }

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (email !== undefined) fields.email = email;
  if (address !== undefined) fields.address = address;
  if (role !== undefined) fields.role = role;

  const updated = await User.update(req.params.id, fields);
  res.json({ user: updated });
});

router.put('/users/:id/password', async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  await User.updatePassword(req.params.id, password);
  res.json({ message: 'Password updated successfully.' });
});

router.delete('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  await User.delete(req.params.id);
  res.json({ message: 'User deleted.' });
});

router.get('/stores', async (req, res) => {
  const { search, sortBy, sortOrder, limit, offset } = req.query;
  const result = await Store.findAll({ search, sortBy, sortOrder, limit, offset });
  res.json(result);
});

router.get('/stores/:id', async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).json({ message: 'Store not found.' });

  const ratings = await Rating.findByStore(req.params.id);
  res.json({ store, ratings });
});

router.post('/stores', createStoreValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const owner = await User.findById(req.body.owner_id);
  if (!owner || owner.role !== 'store_owner') {
    return res.status(400).json({ message: 'Invalid store owner.' });
  }

  const store = await Store.create({
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    owner_id: req.body.owner_id,
  });

  res.status(201).json({ store });
});

router.put('/stores/:id', async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).json({ message: 'Store not found.' });

  const fields = {};
  if (req.body.name !== undefined) fields.name = req.body.name;
  if (req.body.email !== undefined) fields.email = req.body.email;
  if (req.body.address !== undefined) fields.address = req.body.address;

  const updated = await Store.update(req.params.id, fields);
  res.json({ store: updated });
});

router.delete('/stores/:id', async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(404).json({ message: 'Store not found.' });
  await Store.delete(req.params.id);
  res.json({ message: 'Store deleted.' });
});

router.delete('/ratings/:id', async (req, res) => {
  await Rating.delete(req.params.id);
  res.json({ message: 'Rating deleted.' });
});

module.exports = router;
