const mongoose = require('mongoose');
const { filterRole } = require('../helpers/helpers');
const ProductModel = require ('../models/product');

exports.getAllProducts = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const products = await ProductModel.find({ supermarketId })
            // .populate('categoryId', 'categoryName description')
            // .populate('supermarketId', 'businessName email')
            // .populate('createdBy', 'firstName lastName');

        console.log(products);

        res.status(200).json({
            message: 'All Products found successfully',
            data: products
        });

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

        const { id: userId, role } = req.user;
        const supermarketId = await filterRole(userId, role);
        const product = await ProductModel.findOne({ _id: id, supermarketId })
            // .populate('categoryId', 'categoryName description')
            // .populate('supermarketId', 'businessName email')
            // .populate('createdBy', 'firstName lastName');

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

exports.getProductsByCategory = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const { categoryId } = req.params;

        const supermarketId = await filterRole(id, role);

        const products = await ProductModel.find({
            supermarketId,
            categoryId
        });

        if (!products.length) {
            return res.status(200).json({
                message: 'No products found for this category'
            });
        }

        res.status(200).json({
            message: 'Products fetched successfully',
            total: products.length,
            data: products
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};