/* istanbul ignore file */
const mongoose = require('mongoose');
const faker = require('faker');
const ProductSubCategory = require('../../models/productSubCategory');
const { categoryOne } = require('./productCategory.fixture');

const subCategoryOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
  category: categoryOne._id,
};

const subCategoryTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
  category: categoryOne._id,
};

const subCategoryThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
  category: categoryOne._id,
};

const subCategoryFour = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
  category: categoryOne._id,
};

const insertSubCategoryList = async (subCategories) => {
  await ProductSubCategory.insertMany(
    subCategories.map((subCategory) => ({ ...subCategory }))
  );
};

module.exports = {
  subCategoryOne,
  subCategoryTwo,
  subCategoryThree,
  subCategoryFour,
  insertSubCategoryList,
};
