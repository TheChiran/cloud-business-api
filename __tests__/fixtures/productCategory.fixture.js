/* istanbul ignore file */
const mongoose = require('mongoose');
const faker = require('faker');
const ProductCategory = require('../../models/productCategory');

const categoryOne = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
};

const categoryTwo = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
};

const categoryThree = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
};

const categoryFour = {
  _id: mongoose.Types.ObjectId(),
  name: faker.name.findName(),
  isActive: true,
};

const insertCategoryList = async (categories) => {
  await ProductCategory.insertMany(
    categories.map((category) => ({ ...category }))
  );
};

module.exports = {
  categoryOne,
  categoryTwo,
  categoryThree,
  categoryFour,
  insertCategoryList,
};
