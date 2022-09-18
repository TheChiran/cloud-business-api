const { body } = require('express-validator');

const productCategoryCreateValidationRules = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Category name is required')
      .isLength(4)
      .withMessage('Category name must have at least 4 characters'),
  ];
};

module.exports = {
  productCategoryCreateValidationRules,
};
