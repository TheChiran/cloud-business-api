const ProductCategory = require('./../models/productCategory');
const factory = require('./handleFactory');

exports.create = factory.createOne(ProductCategory);
exports.getList = factory.getAll(ProductCategory);
exports.getOne = factory.getOne(ProductCategory);
exports.update = factory.updateOne(ProductCategory);
exports.delete = factory.deleteOne(ProductCategory);
