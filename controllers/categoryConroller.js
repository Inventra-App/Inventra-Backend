// const { Error } = require('mongoose');
const mongoose = require('mongoose');
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');
const UserModel = require('../models/supermarket');
const { getPagination } = require('../helpers/pagination');
const { filterRole } = require('../helpers/helpers');



exports.createCategory = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);

        const { categoryName, description } = req.body;

        // Check if category already exists
        const existingCategory = await CategoryModel.findOne({
            supermarketId,
            categoryName: categoryName.trim()
        });

        if (existingCategory) {
            return res.status(400).json({
                message: 'Category already exists'
            });
        }

        const newCategory = await CategoryModel.create({
            supermarketId,
            categoryName,
            description
        });

        await logActivity({
            supermarket: supermarketId,
            user: id,
            title: 'Created category',
            module: 'CATEGORY',
            description: `Created category ${newCategory.categoryName}`,
            entityId: newCategory._id
        });

        res.status(201).json({
            message: 'Category added successfully',
            data: newCategory
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

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
};

exports.updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;

        const supermarketId = await filterRole(userId, role);
        const { categoryName, description } = req.body;

        const category = await CategoryModel.findOne({
            _id: id,
            supermarketId
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        // Prevent duplicate category names
        if (categoryName) {
            const existingCategory = await CategoryModel.findOne({
                supermarketId,
                categoryName: categoryName.trim(),
                _id: { $ne: id }
            });

            if (existingCategory) {
                return res.status(400).json({
                    message: 'Category name already exists'
                });
            }
        }

        category.categoryName = categoryName || category.categoryName;
        category.description = description || category.description;

        await category.save();

        await logActivity({
            supermarket: supermarketId,
            user: userId,
            title: 'Updated category',
            module: 'CATEGORY',
            description: `Updated category ${category.categoryName}`,
            entityId: category._id
        });

        res.status(200).json({
            message: 'Category updated successfully',
            data: category
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};


exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { id: userId, role } = req.user;
        console.log(`here: `, id)

        const supermarketId = await filterRole(userId, role);

        const category = await CategoryModel.findOne({
            _id: id,
            supermarketId
        });

        if (!category) {
            return res.status(404).json({
                message: 'Category not found'
            });
        }

        const productCount = await ProductModel.countDocuments({
            categoryId: id,
            supermarketId
        });

        if (productCount > 0) {
            return res.status(400).json({
                message: 'Cannot delete category. Products are attached to it.'
            });
        }

        await CategoryModel.findByIdAndDelete(id);

        await logActivity({
            supermarket: supermarketId,
            user: userId,
            title: 'Deleted category',
            module: 'CATEGORY',
            description: `Deleted category ${category.categoryName}`,
            entityId: category._id
        });

        res.status(200).json({
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};





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
