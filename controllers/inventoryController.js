const InventoryModel = require('../models/inventory');
const SupermarketModel = require('../models/supermarket');
const CategoryModel = require('../models/category');
const {generateBatchCode} = require('./helpers/helpers');



exports.addProducts = async (req, res, next) => {
    try {
        const {role, id} = req.user;
        if (role !== 'admin' || role !== 'manager') {
            return res.status(403).json({
                message: `You are not authorised to perform this action!`
            })
        };
        
        const { 
            productName,
            categoryId,
            packageType,
            unitPerPackage,
            unitPrice,
            expiryDate
        } = req.body;
        
        const ifCategory = await CategoryModel.findById(categoryId)
        if (!ifCategory) {
            return res.status(404).json({
                message: `Category not found!`
            })
        }
        const code = generateBatchCode();

        const product = {
            supermarketId: id,
            productName,
            categoryId,
            category: ifCategory.categoryName,
            
        }
         

    } catch (error) {
        console.log(error)
        next(error)
    }
} 