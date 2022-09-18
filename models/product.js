const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is must'],
      min: [4, 'Product name must be at least 4 characters'],
    },
    description: {
      type: String,
      require: [true, 'Please provide a description'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductSubCategory',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  let categoryName = this.name;
  this.name = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = ProductCategory;
