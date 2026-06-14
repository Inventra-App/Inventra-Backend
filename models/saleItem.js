const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema({
    saleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
        required: true
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    productName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    unitPrice: {
        type: Number,
        required: true
    },

    subtotal: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("SaleItem", saleItemSchema);