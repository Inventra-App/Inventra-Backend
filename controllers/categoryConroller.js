// const { Error } = require('mongoose');
const mongoose = require('mongoose');
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');
const UserModel = require('../models/supermarket');
const { getPagination } = require('../helpers/pagination');
const { filterRole } = require('../helpers/helpers');



exports.createCategory = async (req, res, next) => {
    try {
        console.log(req.user)
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        console.log( id )

        const { categoryName, description } = req.body;

        const category = {
            supermarketId,
            categoryName,
            description,
        }

        const newCategory = new CategoryModel(category)
        console.log(newCategory)

        await newCategory.save();

        res.status(201).json({
            message: `Category added sucessfuly`,
            data: newCategory
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getCategories = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const allCategories = await CategoryModel.find({ supermarketId }).sort('desc');

        if (!allCategories) {
            return res.status(404).json({
                message: `No content!`
            })
        }

        res.status(200).json({
            message: `All categories Feteched Sucessfuly`,
            data: allCategories
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
exports.getOneCategory = async(req,res,next) =>{
              try {
                const { id } = req.params;
        
                if (!mongoose.isValidObjectId(id)) {
                    return res.status(400).json({
                        message: 'Invalid category ID format.'
                    });
                }
        
                const { id: userId, role } = req.user;
                const supermarketId = await filterRole(userId, role);
                const category = await CategoryModel.findOne({ _id: id, supermarketId });
        
                if (!category) {
                    return res.status(404).json({
                        message: `category not found!`
                    })
                }
        
                res.status(200).json({
                    message: `category found  successfully`,
                    data: category
                })
    } catch (error) {
        console.log(error)
        next(error)
        
    }
}


exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { id: userId, role } = req.user;
        const supermarketId = await filterRole(userId, role);
        const category = await CategoryModel.findOne({ _id: id, supermarketId });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found!'
            });
        }

        const products = await ProductModel.find({
            categoryId: id,
            supermarketId
        });

        if (products.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete category. Products are attached to it.'
            });
        }

        await CategoryModel.findOneAndDelete({ _id: id, supermarketId });

        res.status(200).json({
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}





// exports.deleteCategory = async (req, res, next) => {
//     try {
//         const { categoryId } = req.params;

//         const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

//         if (!deletedCategory) {
//             return res.status(404).json({
//                 message: "Category not found"
//             });
//         }

//         res.status(200).json({
//             message: "Category successfully deleted"
//         });

//     } catch (error) {
//         console.log(error);
//         next(error);
//     }
// };
