const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { validationResult } = require('express-validator');
const httpStatus = require('http-status');

const signToken = (_id) =>
  jwt.sign(
    {
      id: _id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // true -> we can't manipulate / change on browser
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;

  //   await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({
    email,
  }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password'), 401);

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError('Your are not logged in! Please log in to get access.'),
      401
    );

  // 2) Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exits
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  res.locals.user = currentUser;

  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles ['admin','lead-guide']
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user)
    return next(new AppError('There is no user with email address.', 404));

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({
    validateBeforeSave: false, // to turn off all required field checking
  });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and
    passwordConfirm to ${resetURL}.\nIf you did't forget your password, please ignore this email!`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    user.createPasswordResetToken = undefined;
    user.createPasswordResetExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // 2) if token has not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  // 3) Update changePasswordAt property for the user

  // 4) Log the user in, send JWT
  createSendToken(user, 201, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

// Only for render pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 2) Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 3) Check if user still exits
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // 4) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;

      return next();
    } catch (error) {
      return next();
    }
  }
  next();
};