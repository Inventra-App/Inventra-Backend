const { Error } = require('mongoose');
const CategoryModel = require('../models/category');
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
exports.getOneCategory = async (req, res, next) => {
    try {
        const { id } = req.params;

        // if (!mongoose.isValidObjectId(id)) {
        //     return res.status(400).json({
        //         message: 'Invalid category ID format.'
        //     });
        // }

        const category = await CategoryModel.findById(id);

        if (!category) {
            return res.status(404).json({
                message: `Category not found!`
            })
        }

        res.status(200).json({
            message: `Category found successfully`,
            data: category
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const {categoryId} = req.params;

        const checkCategory = await CategoryModel.findById({categoryId});
        if (!checkCategory) {
            return res.status(404).json({
                message: `Category not found`
            })
        }

        await CategoryModel.findByIdAndDelete({categoryId})

        res.status(200).json({
            message: `Category sucessfuly deleted`
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}