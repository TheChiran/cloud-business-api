const { body } = require('express-validator');

const productSubCategoryCreateValidationRules = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Sub Category name is required')
      .isLength(4)
      .withMessage('SUb Category name must have at least 4 characters'),

    body('category')
      .not()
      .isEmpty()
      .withMessage('Category is required')
      .isMongoId(4)
      .withMessage('Category must be mongodb id'),
  ];
};

module.exports = {
  productSubCategoryCreateValidationRules,
};
