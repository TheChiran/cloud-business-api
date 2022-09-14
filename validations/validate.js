const { validationResult } = require('express-validator');
const httpStatus = require('http-status');

const validateInputFields = (req, res, next) => {
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
  validateInputFields,
};
