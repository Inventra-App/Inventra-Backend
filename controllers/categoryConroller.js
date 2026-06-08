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