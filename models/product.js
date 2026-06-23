const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    supermarketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supermarket',
      required: true
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true
    },

    categoryName: {
        type: String,
        required: true
    },

    productName: {
      type: String,
      required: true,
      trim: true
    },

    SKU: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    // barcode: {
    //   type: String,
    //   trim: true
    // },  

    packageType: {
      type: String,
      required: true,
      trim: true
    },

    packageQuantity: {
      type: Number,
      // required: true,
      min: 1
    },

    unitPerPackage: {
      type: Number,
      // required: true,
      min: 1
    },

    reorderLevel: {
      type: Number,
      default: 10,
      min: 0
    },

    unitPrice: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'staff',
      required: true
    }
  },
  { timestamps: true }
);

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;   