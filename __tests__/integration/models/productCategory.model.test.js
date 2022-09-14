const {
  categoryOne,
  categoryTwo,
} = require('../../fixtures/productCategory.fixture');
const setupTestDB = require('../../../configs/setupTestDB');
const mongoose = require('mongoose');
const ProductCategory = require('../../../models/productCategory');

setupTestDB();

describe('Test cases for product category model', () => {
  it('should create category successfully', async () => {
    const validCategory = new ProductCategory(categoryOne);
    const savedCategory = await validCategory.save();

    expect(savedCategory._id).toBeDefined();
    expect(savedCategory.name).toBe(categoryOne.name);
    expect(savedCategory.isActive).toBe(categoryOne.isActive);
  });

  it('Should through an mongoose error error of duplicate keys', async () => {
    const firstCategory = new ProductCategory(categoryOne);
    await firstCategory.save();
    const secondCategory = new ProductCategory(categoryOne);
    let err;
    try {
      await secondCategory.save();
    } catch (error) {
      err = error;
    }

    expect(err.code).toBe(11000);
  });

  it('Should through error if passing empty object', async () => {
    const firstCategory = new ProductCategory({});

    let err;
    try {
      await firstCategory.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('Saved data should contain first letter as capital ', async () => {
    const firstCategory = new ProductCategory({ name: 'electronics' });

    const savedCategory = await firstCategory.save();

    expect(savedCategory.name.charAt(0)).toBe('E');
  });
});
