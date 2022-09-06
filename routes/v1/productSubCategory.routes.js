const express = require('express');
const authController = require('../../controllers/authController');

const router = express.Router();

// this will work for rest of below routes (after this middleware)
router.use(authController.restrictTo('admin'));

module.exports = router;
