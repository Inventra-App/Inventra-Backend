const mongoose = require('mongoose');
const ProductModel = require ('../models/product');
const { getPagination } = require('../helpers/pagination');



exports.getAllItems = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req);

        const totalItems = await InventoryModel.countDocuments();

        const items = await InventoryModel.find()
            .skip(skip)
            .limit(limit);

        if (items.length === 0) {
            return res.status(404).json({
                message: `Nothing found here. Please upload your products`
            });
        }

        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            message: `Product details fetched successfully`,
            data: items,
            pagination: {
                currentPage: page,
                perPage: limit,
                totalItems,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};








//   formal get all before pagination
// exports.getAllProducts = async (req, res, next) => {
//     try {
//         const products = await ProductModel.find()
//             // .populate('categoryId', 'categoryName description')
//             // .populate('supermarketId', 'businessName email')
//             // .populate('createdBy', 'firstName lastName');

//         console.log(products);

//         res.status(200).json({
//             message: 'All Products found successfully',
//             data: products
//         });

//         next(error);
//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// }



exports.getOneProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid product ID format.'
            });
        }

        const product = await ProductModel.findById(id)
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