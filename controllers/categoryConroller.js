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
            message: `Feteched Sucessfuly`,
            data: allCategories
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}