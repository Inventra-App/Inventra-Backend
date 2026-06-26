// const mongoose = require('mongoose');

// const InventorySchema = new mongoose.Schema(
//   {
//     supermarketId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'supermarket',
//       required: true
//     },

//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true,
//       unique: true
//     },

//     SKU: {
//        type: String,
//         required: true
//     },

//     categoryName: {
//         type: String,
//         required: true
//     },

//     totalStock: {
//       type: Number,
//       default: 0,
//       required: true
//     },

//     availableStock: {
//       type: Number,
//       default: 0,
//       min: 0
//     },

//     reservedStock: {
//       type: Number,
//       default: 0,
//       min: 0
//     },

//     updatedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'staff'
//     },
//     isComplete: {
//       type: Boolean,
//       default: false
//     }
//   },
//   {
//     timestamps: true,
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true }
//   }
// );

// InventorySchema.virtual('status').get(function () {
//     if (this.totalStock <= 0) return 'out-of-stock';
//     if (this.totalStock <= 10) return 'low-stock';
//     return 'in-stock';
// });

// const InventoryModel = mongoose.model('Inventory', InventorySchema);

// module.exports = InventoryModel;

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

    SKU: {
      type: String,
      required: true
    },

    categoryName: {
      type: String,
      required: true
    },

    availableStock: {
      type: Number,
      default: 0,
      min: 0
    },

    backroomStock: {
      type: Number,
      default: 0,
      min: 0
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'staff'
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual total stock
InventorySchema.virtual('totalStock').get(function () {
  return this.availableStock + this.backroomStock;
});



// Virtual status
InventorySchema.virtual('status').get(function () {
  if (this.totalStock <= 0) return 'out-of-stock';
  if (this.totalStock <= 10) return 'low-stock';
  return 'in-stock';
});

const InventoryModel = mongoose.model('Inventory', InventorySchema);

module.exports = InventoryModel;