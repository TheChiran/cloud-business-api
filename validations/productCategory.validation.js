const { body, validationResult } = require('express-validator');
const httpStatus = require('http-status');
const AppError = require('../utils/appError');

const productCategoryValidationRules = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('Category name is required')
      .isLength(4)
      .withMessage('Category name must have at least 4 characters'),
  ];
};

const productCategoryValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
    status: 'error',
    errors: extractedErrors,
  });
};

module.exports = {
  productCategoryValidationRules,
  productCategoryValidate,
};
