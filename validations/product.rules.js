const { body } = require('express-validator');

const productCreateValidationRules = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Product name is required')
      .isLength({ min: 4 })
      .withMessage('Product name must have at least 4 characters'),
    body('description')
      .not()
      .isEmpty()
      .withMessage('Product description is required')
      .isLength({ min: 20 })
      .withMessage('Product description must have at least 20 characters'),
  ];
};

module.exports = {
  productCreateValidationRules,
};
