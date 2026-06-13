// const mongoose = require('mongoose');

// const cartSchema = new mongoose.Schema({

//     supermarketId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Supermarket',
//         required: true
//     },

//     cashierId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Staff',
//         required: true
//     },

//     cartNumber: {
//         type: String,
//         required: true,
//         unique: true
//     },

//     status: {
//         type: String,
//         enum: [
//             'active',
//             'checked-out',
//             'cancelled',
//             'suspended'
//         ],
//         default: 'active'
//     },

//     totalAmount: {
//         type: Number,
//         default: 0
//     },

//     totalItems: {
//         type: Number,
//         default: 0
//     }
// }, {
//     timestamps: true
// });

// const CartModel = mongoose.model('cart', cartSchema);

// module.exports = CartModel;

// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({

//     cartId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Cart',
//         required: true
//     },

//     productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//     },

//     productName: {
//         type: String,
//         required: true
//     },

//     quantity: {
//         type: Number,
//         required: true,
//         default: 1
//     },

//     unitPrice: {
//         type: Number,
//         required: true
//     },

//     discount: {
//         type: Number,
//         default: 0
//     },

//     subtotal: {
//         type: Number,
//         required: true
//     }
// }, {
//     timestamps: true
// });

// const CartItemModel = mongoose.model('cartItem', cartItemSchema);

// module.exports = CartItemModel;

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

    subtotal: {
        type: Number,
        required: true
    },

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