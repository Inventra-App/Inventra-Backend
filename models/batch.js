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

    status: {
      type: String,
      enum: [
        'active',
        'expired',
        'depleted'
      ],
      default: 'active'
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

const BatchModel = mongoose.model('batch', batchSchema);

module.exports = BatchModel;