/* istanbul ignore file */
const { userOne, admin } = require('./user.fixture');
const jwt = require('jsonwebtoken');

userOne.password = undefined;
admin.password = undefined;

const userOneAccessToken = () => {
  return {
    token: jwt.sign(
      {
        id: userOne._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    ),
    data: {
      userOne,
    },
  };
};

const adminAccessToken = () => {
  return {
    token: jwt.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    ),
    data: {
      admin,
    },
  };
};

module.exports = {
  userOneAccessToken,
  adminAccessToken,
};
