const mongoose = require('mongoose');
const validator = require('validator');

const productCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product category must have a name'],
      unique: [true, 'Product category must be unique'],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productCategorySchema.pre('save', function (next) {
  let categoryName = this.name;
  this.name = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  next();
});

const ProductCategory = mongoose.model(
  'ProductCategory',
  productCategorySchema
);

module.exports = ProductCategory;
