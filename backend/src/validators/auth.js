const { body } = require('express-validator');

const passwordRule = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/[!@#$%^&*(),.?":{}|<>]/)
  .withMessage('Password must contain at least one special character');

const signupValidation = [
  body('name')
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be 20-60 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Enter a valid email')
    .normalizeEmail(),
  passwordRule,
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters')
    .trim(),
  body('role')
    .optional()
    .isIn(['admin', 'user', 'store_owner'])
    .withMessage('Invalid role'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  passwordRule,
];

module.exports = { signupValidation, loginValidation, updatePasswordValidation };
