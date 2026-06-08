const mongoose = require('mongoose');

const categorySchema =new  mongoose.Schema({
    supermarketId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    categoryName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    }
},{ timestamps: true });

const CategoryModel = mongoose.model('category', categorySchema);

module.exports = CategoryModel;