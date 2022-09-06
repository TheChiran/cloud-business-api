const ProductCategory = require('./../models/productCategory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handleFactory');

exports.create = factory.createOne(ProductCategory);
exports.getList = factory.getAll(ProductCategory);
exports.getOne = factory.getOne(ProductCategory);
