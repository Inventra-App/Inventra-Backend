const { required } = require('joi');
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    supermarketId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'supermarket'
    },
    productName: {
        type: String,
        required: true,
        trim: tru
    },
    categoryId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'category',
    },
    productId: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    availableStock: {
        type: Number,
        required: true,
        default: 0
    },
    stockReceieved: {
        type: Number,
        required: true,
        default: 0
    },
    reservedStock: {
        type: Number,
        required: true,
        default: 0
    },
    totalStock: {
        type: Number,
        required: true,
        default: 0
    },
    batchCode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['in-stock', 'out-of-stock'],
        required: true
    },
    batches: {
        type: Number,
        required: true,
        default: 0
    },
    packageType: {
        type: String,
        required: true,
        trim: true
    },
    unitPerPackage: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const InventoryModel = mongoose.model('Inventory', inventorySchema);
module.exports = InventoryModel