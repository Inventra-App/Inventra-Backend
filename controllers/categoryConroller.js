const { Error } = require('mongoose');
const CategoryModel = require('../models/category');
const ProductModel = require('../models/product');
const UserModel = require('../models/supermarket');

exports.createCategory = async (req, res, next) => {
    try {
        console.log(req.user)
        const { id } = req.user;
        console.log( id )

        const { categoryName, description } = req.body;

        const category = {
            supermarketId: id,
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
        const allCategories = await CategoryModel.find().sort('desc');

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
        
                const category = await ProductModel.findById(id);
        
                if (!category) {
                    return res.status(404).json({
                        message: `category not found!`
                    })
                }
        
                res.status(200).json({
                    message: `category found  successfully`,
                    data: product
                })
    } catch (error) {
        console.log(error)
        next(error)
        
    }
}


exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        const category = await CategoryModel.findById(id);

        if (!category) {
            return res.status(404).json({
                message: 'Category not found!'
            });
        }

        const products = await ProductModel.find({
            categoryId: id
        });

        if (products.length > 0) {
            return res.status(400).json({
                message: 'Cannot delete category. Products are attached to it.'
            });
        }

        await CategoryModel.findByIdAndDelete(id);

        res.status(200).json({
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const { categoryId } = req.params;

        const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category successfully deleted"
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
