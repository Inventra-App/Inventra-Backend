const mongoose = require('mongoose');
const { filterRole } = require('../helpers/helpers');
const ProductModel = require ('../models/product');
const { getPagination } = require('../helpers/pagination');
const InventoryModel = require('../models/inventory');
const CategoryModel = require('../models/category');

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

// exports.getProductsByCategory = async (req, res, next) => {
//     try {
//         const { categoryId } = req.params;

//         if (!mongoose.isValidObjectId(categoryId)) {
//             return res.status(400).json({
//                 message: 'Invalid category ID format.'
//             });
//         }

//         const { id: userId, role } = req.user;
//         const supermarketId = await filterRole(userId, role);

//         const category = await CategoryModel.findOne({ _id: categoryId, supermarketId });
//         if (!category) {
//             return res.status(404).json({
//                 message: 'Category not found!'
//             });
//         }

//         const products = await ProductModel.find({ categoryId, supermarketId,status:'Active' });

//         res.status(200).json({
//             message: 'Products found successfully',
//             category: category.categoryName,
//             count: products.length,
//             data: products
//         });

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };

exports.updateProduct = async (req, res, next) => {
    try {
        const { role } = req.user;

        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).json({
                message: 'You are not authorised to perform this action!'
            });
        }

        const { productId } = req.params;

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found!'
            });
        }

        const {
            productName,
            categoryId,
            packageType,
            packageQuantity,
            unitPerPackage,
            unitPrice,
            reorderLevel,
            status
        } = req.body;

        let selectedCategoryId = categoryId ?? product.categoryId;
        let categoryName = product.categoryName;

        if (categoryId) {
            const category = await CategoryModel.findById(categoryId);

            if (!category) {
                return res.status(404).json({
                    message: 'Category not found!'
                });
            }

            categoryName = category.categoryName;
        }

        const updatedData = {
            productName: productName ?? product.productName,
            categoryId: selectedCategoryId,
            categoryName,
            packageType: packageType ?? product.packageType,
            packageQuantity: packageQuantity ?? product.packageQuantity,
            unitPerPackage: unitPerPackage ?? product.unitPerPackage,
            unitPrice: unitPrice ?? product.unitPrice,
            reorderLevel: reorderLevel ?? product.reorderLevel,
            status: status ?? product.status
        };

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            updatedData,
            { new: true }
        );

        res.status(200).json({
            message: 'Product updated successfully',
            data: updatedProduct
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};