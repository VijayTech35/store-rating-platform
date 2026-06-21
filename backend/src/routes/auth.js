const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { jwtSecret, jwtExpiresIn } = require('../config/auth');
const { signupValidation, loginValidation, updatePasswordValidation } = require('../validators/auth');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signupValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const existing = await User.findByEmail(req.body.email);
  if (existing) {
    return res.status(409).json({ message: 'Email already registered.' });
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    address: req.body.address,
    role: 'user',
  });

  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });

  res.status(201).json({ user, token });
});

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const user = await User.findByEmail(req.body.email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(req.body.password, user.password_hash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: jwtExpiresIn });

  const { password_hash, ...userData } = user;
  res.json({ user: userData, token });
});

router.put('/password', authenticate, updatePasswordValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const user = await User.findByEmail(req.user.email);
  const isMatch = bcrypt.compareSync(req.body.currentPassword, user.password_hash);
  if (!isMatch) {
    return res.status(400).json({ message: 'Current password is incorrect.' });
  }

  await User.updatePassword(req.user.id, req.body.password);
  res.json({ message: 'Password updated successfully.' });
});

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

const { body } = require('express-validator');
router.put('/profile', authenticate, [
  body('name').optional().isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters').trim(),
  body('email').optional().isEmail().withMessage('Enter a valid email').normalizeEmail(),
  body('address').optional().isLength({ max: 400 }).withMessage('Address must be at most 400 characters').trim(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  const { name, email, address } = req.body;

  if (email && email !== req.user.email) {
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ message: 'Email already in use.' });
  }

  const fields = {};
  if (name !== undefined) fields.name = name;
  if (email !== undefined) fields.email = email;
  if (address !== undefined) fields.address = address;

  const updated = await User.update(req.user.id, fields);
  res.json({ user: updated });
});

module.exports = router;
