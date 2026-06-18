const mongoose = require('mongoose');
const ProductModel = require ('../models/product');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await ProductModel.find()
            .populate('categoryId', 'categoryName description')
            .populate('supermarketId', 'businessName email')
            .populate('createdBy', 'firstName lastName');

        console.log(products);

        res.status(200).json({
            message: 'All Products found successfully',
            data: products
        });

        next(error);
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getOneProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid product ID format.'
            });
        }

        const product = await ProductModel.findById(id)
            .populate('categoryId', 'categoryName description')
            .populate('supermarketId', 'businessName email')
            .populate('createdBy', 'firstName lastName');

        if (!product) {
            return res.status(404).json({
                message: 'Product not found!'
            });
        }
 
        res.status(200).json({
            message: 'Product found successfully',
            data: product
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}