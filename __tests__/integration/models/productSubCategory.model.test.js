const { categoryOne } = require('../../fixtures/productCategory.fixture');
const {
  subCategoryOne,
  subCategoryTwo,
  subCategoryThree,
  subCategoryFour,
} = require('../../fixtures/productSubCategory.fixtures');
const setupTestDB = require('../../../configs/setupTestDB');
const mongoose = require('mongoose');
const ProductSubCategory = require('../../../models/productSubCategory');
const ProductCategory = require('../../../models/productCategory');

setupTestDB();

describe('Test cases for product sub category model', () => {
  describe('Post method testing', () => {
    it('should create sub category successfully', async () => {
      const validSubCategory = new ProductSubCategory(subCategoryOne);
      const savedSubCategory = await validSubCategory.save();

      expect(savedSubCategory._id).toBeDefined();
      expect(savedSubCategory.name).toBe(subCategoryOne.name);
      expect(savedSubCategory.isActive).toBe(subCategoryOne.isActive);
      expect(savedSubCategory.category).toBe(categoryOne._id);
    });

    it('Should create sub category and should match categoryOne object when find one sub category', async () => {
      const validSubCategory = new ProductSubCategory(subCategoryOne);
      const category = new ProductCategory(categoryOne);
      await category.save();
      const savedSubCategory = await validSubCategory.save();
      const subCategory = await ProductSubCategory.findById(
        savedSubCategory._id
      ).populate('category');

      expect(subCategory.category).toMatchObject(categoryOne);
    });

    it('Should through an mongoose error error of duplicate keys', async () => {
      const firstSubCategory = new ProductSubCategory(subCategoryOne);
      await firstSubCategory.save();
      const secondSubCategory = new ProductSubCategory(subCategoryOne);
      let err;
      try {
        await secondSubCategory.save();
      } catch (error) {
        err = error;
      }

      expect(err.code).toBe(11000);
    });

    it('Should through error if passed data is empty', async () => {
      const subCategory = new ProductSubCategory({});

      let err;
      try {
        await subCategory.save();
      } catch (error) {
        err = error;
      }

      expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('Saved data should contain first letter as capital ', async () => {
      const subCategory = new ProductSubCategory({
        name: 'mobile phone',
        category: categoryOne._id,
      });

      const savedSubCategory = await subCategory.save();

      expect(savedSubCategory.name.charAt(0)).toBe('M');
    });
  });
});
