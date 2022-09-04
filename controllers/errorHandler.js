const httpStatus = require('http-status');
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, httpStatus.BAD_REQUEST);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', httpStatus.UNAUTHORIZED);

const handleJWTExpiredError = () =>
  new AppError(
    'Your token has expired! Please log in again!',
    httpStatus.UNAUTHORIZED
  );

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, httpStatus.BAD_REQUEST);
};

const sendErrorDev = (error, req, res) => {
  // API
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Something went very wrong!',
  });
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errorObj = {
      ...error,
    };
    errorObj.message = error.message;
    errorObj.name = error.name;
    if (errorObj.name === 'CastError') errorObj = handleCastErrorDB(errorObj);
    if (errorObj.code === 11000) errorObj = handleDuplicateFieldsDB(errorObj);
    if (errorObj.name === 'ValidationError')
      errorObj = handleValidationErrorDB(errorObj);
    if (errorObj.name === 'JsonWebTokenError') errorObj = handleJWTError();
    if (errorObj.name === 'TokenExpiredError')
      errorObj = handleJWTExpiredError();

    sendErrorProd(errorObj, req, res);
  }
};
