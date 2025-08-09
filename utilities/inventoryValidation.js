const { body } = require('express-validator')

const validateInventory = [
  body('classification_id')
    .trim()
    .notEmpty()
    .withMessage('Classification is required.')
    .isInt({ min: 1 })
    .withMessage('Classification must be a valid number.'),

  body('inv_year')
    .trim()
    .notEmpty()
    .withMessage('Year is required.')
    .isInt({ min: 1900, max: 2100 })
    .withMessage('Year must be a valid 4-digit number.'),

  body('inv_make')
    .trim()
    .notEmpty()
    .withMessage('Make is required.')
    .isLength({ min: 3 })
    .withMessage('Make must be at least 3 characters.'),

  body('inv_model')
    .trim()
    .notEmpty()
    .withMessage('Model is required.')
    .isLength({ min: 3 })
    .withMessage('Model must be at least 3 characters.'),

  body('inv_description')
    .trim()
    .notEmpty()
    .withMessage('Description is required.'),

  body('inv_price')
    .trim()
    .notEmpty()
    .withMessage('Price is required.')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number.'),

  body('inv_miles')
    .trim()
    .notEmpty()
    .withMessage('Mileage is required.')
    .isInt({ min: 0 })
    .withMessage('Mileage must be a positive integer.'),

  body('inv_color')
    .trim()
    .notEmpty()
    .withMessage('Color is required.'),

  body('inv_image')
    .optional({ checkFalsy: true }),

  body('inv_thumbnail')
    .optional({ checkFalsy: true }),
]

module.exports = {
  validateInventory,
}
