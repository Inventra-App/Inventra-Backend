const InventoryModel = require('../models/inventory');
const ProductModel = require('../models/product')
const { mapPricesAndAdd } = require('../helpers/helpers')


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
        nect(error)
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
