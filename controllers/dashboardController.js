const InventoryModel = require('../models/inventory');
const ProductModel = require('../models/product')
const SaleModel = require('../models/sale');
const { mapPricesAndAdd } = require('../helpers/helpers');


exports.getTotalStockUnits = async(req, res, next) => {
    try {
        const allStockUnits = await InventoryModel.find()
        
        const totalStockUnits = mapPricesAndAdd(allStockUnits)
        console.log(totalStockUnits)

        res.status(200).json({
            message: `Total Units Fetched Successfully`,
            data: totalStockUnits
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getTotalProducts = async(req, res, next) => {
    try {
        const allProducts = await ProductModel.countDocuments()

        res.status(200).json({
            message: `Products Fetched Successfully`,
            data: allProducts
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.countSales = async (req, res, next) => {
    try {
        const totalSales = await SaleModel.countDocuments();

        if (!totalSales) {
            return res.status(404).json({
                message: `Nothing sold yet. Come back when you make a sale!`
            })
        }

        res.status(200).json({
            message: `Total sales`,
            data: totalSales
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}
