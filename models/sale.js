const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
    saleNumber: {
        type: String,
        unique: true
    },

    supermarketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Supermarket",
        required: true
    },

    cashierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    paymentMethod: {
        type: String,
        enum: ["cash", "card", "transfer"],
        default: "cash"
    },

    totalItems: {
        type: Number,
        required: true
    },

    // subtotal: {
    //     type: Number,
    //     required: true
    // },

    discount: {
        type: Number,
        default: 0
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ["completed", "cancelled", "refunded"],
        default: "completed"
    },

    items: [
        {
            productId: mongoose.Schema.Types.ObjectId,
            productName: String,
            quantity: Number,
            unitPrice: Number,
            subtotal: Number
        }
    ]
}, {
    timestamps: true
});

const saleModel = mongoose.model("Sale", saleSchema);

module.exports = saleModel