const { body } = require('express-validator');

const createStoreValidation = [
  body('name')
    .isLength({ min: 1, max: 60 })
    .withMessage('Store name must be 1-60 characters')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Enter a valid email')
    .normalizeEmail(),
  body('address')
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters')
    .trim(),
  body('owner_id')
    .isInt({ min: 1 })
    .withMessage('Valid owner ID is required'),
];

module.exports = { createStoreValidation };
