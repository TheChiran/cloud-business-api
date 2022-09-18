const ProductSubCategory = require('./../models/productSubCategory');
const factory = require('./handleFactory');

exports.create = factory.createOne(ProductSubCategory);
exports.getList = factory.getAll(ProductSubCategory);
exports.getOne = factory.getOne(ProductSubCategory, 'category');
exports.update = factory.updateOne(ProductSubCategory);
exports.delete = factory.deleteOne(ProductSubCategory);
