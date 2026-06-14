const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    supermarketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supermarket',
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      unique: true
    },

    categoryName: {
        type: String,
        required: true
    },

    totalStock: {
      type: Number,
      default: 0,
      required: true
    },

    availableStock: {
      type: Number,
      default: 0,
      min: 0
    },

    reservedStock: {
      type: Number,
      default: 0,
      min: 0
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'staff'
    },
    isComplete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const InventoryModel = mongoose.model('Inventory', InventorySchema);

module.exports = InventoryModel;