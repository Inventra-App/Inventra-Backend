const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
     supermarketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'supermarket',
      required: true
    },

    inventoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',
      required: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },

    batchCode: {
      type: String,
      required: true,
      trim: true
    },

    supplier: {
      type: String,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    quantityRemaining: {
      type: Number,
      required: true,
      min: 0
    },

    unitCost: {
      type: Number,
      required: true,
      min: 0
    },

    expiryDate: {
      type: Date,
      // required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'staff',
      required: true
    }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

batchSchema.virtual('isExpiring').get(function () {
  if (this.expiryDate === null) return false;
  if (this.expiryDate !== null) return true;
  return 'isExpiring';
});

batchSchema.virtual('status').get(function () {
    const today = new Date();

    if (this.quantityRemaining <= 0) {
        return 'depleted';
    }

    if (this.expiryDate && this.expiryDate < today) {
        return 'expired';
    }

    return 'active';
});

const BatchModel = mongoose.model('batch', batchSchema);

module.exports = BatchModel;