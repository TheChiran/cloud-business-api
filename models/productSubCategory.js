const mongoose = require('mongoose');

const productSubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a sub category name'],
      unique: [true, 'Product sub category must be unique'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: [true, 'Please provide a category'],
    },
  },
  { timestamps: true }
);

productSubCategorySchema.pre('save', function (next) {
  let subCategoryName = this.name;
  this.name =
    subCategoryName.charAt(0).toUpperCase() + subCategoryName.slice(1);

  next();
});

const ProductSubCategory = mongoose.model(
  'ProductSubCategory',
  productSubCategorySchema
);

module.exports = ProductSubCategory;
