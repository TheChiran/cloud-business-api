const express = require('express');
const authController = require('../../controllers/authController');
const productCategoryController = require('../../controllers/productCategoryController');
const {
  productCategoryValidationRules,
  productCategoryValidate,
} = require('./../../validations/productCategory.validation');

const router = express.Router();

// this will work for rest of below routes (after this middleware)

router.get('/', productCategoryController.getList);

router.get('/:id', productCategoryController.getOne);

router.use(authController.protect);
router.use(authController.restrictTo('admin'));

router.post(
  '/',
  productCategoryValidationRules(),
  productCategoryValidate,
  productCategoryController.create
);

router
  .route('/:id')
  .delete(productCategoryController.delete)
  .patch(productCategoryController.update);

module.exports = router;
