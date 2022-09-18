const express = require('express');
const authController = require('../../controllers/authController');
const productSubCategoryController = require('../../controllers/productSubCategoryController');
const { validateInputFields } = require('../../validations/validate');
const {
  productSubCategoryCreateValidationRules,
} = require('./../../validations/productSubCategory.validation.rules');

const router = express.Router();

// this will work for rest of below routes (after this middleware)

router.get('/', productSubCategoryController.getList);

router.get('/:id', productSubCategoryController.getOne);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post(
  '/',
  productSubCategoryCreateValidationRules(),
  validateInputFields,
  productSubCategoryController.create
);

router
  .route('/:id')
  .delete(productSubCategoryController.delete)
  .patch(productSubCategoryController.update);

module.exports = router;
