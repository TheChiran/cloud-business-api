const mongoose = require('mongoose');
const validator = require('validator');

const productSubCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell use your name'],
    },
    isActive: {
      type: Boolean,
      default: false,
      validate: [
        validator.isBoolean,
        'Please provide a valid boolean value [true,false]',
      ],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
    },
  },
  { timestamps: true }
);

const ProductSubCategory = mongoose.model(
  'ProductSubCategory',
  productSubCategorySchema
);

module.exports = ProductSubCategory;
