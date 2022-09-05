const { body, validationResult } = require('express-validator');
const httpStatus = require('http-status');
const AppError = require('../utils/appError');

const userRegisterValidationRules = () => {
  return [
    body('name')
      .not()
      .isEmpty()
      .withMessage('User name is required')
      .isLength(3)
      .withMessage('Username must be at least 3 characters'),

    body('email').isEmail().withMessage('User must provide email'),

    body('password')
      .not()
      .isEmpty()
      .withMessage('password is required')
      .isLength({ min: 8 })
      .withMessage('Password must be of minimum 8 characters'),

    body('passwordConfirm')
      .not()
      .isEmpty()
      .withMessage('Password confirm is required')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }

        // Indicates the success of this synchronous custom validator
        return true;
      }),
  ];
};

const userRegisterValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) return next();

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg })); // maps the error inside the extractedErrors array

  return res.status(httpStatus.UNPROCESSABLE_ENTITY).send({
    status: 'error',
    errors: extractedErrors,
  });
};

module.exports = {
  userRegisterValidationRules,
  userRegisterValidate,
};
