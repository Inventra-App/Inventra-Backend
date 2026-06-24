const InventoryModel = require('../models/inventory');
const ProductModel = require('../models/product')
const SaleModel = require('../models/sale');
const { mapPricesAndAdd, filterRole } = require('../helpers/helpers');


exports.getTotalStockUnits = async(req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const allStockUnits = await InventoryModel.find({ supermarketId })
        
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
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const allProducts = await ProductModel.countDocuments({ supermarketId })

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
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const totalSales = await SaleModel.countDocuments({ supermarketId });

        if (!totalSales) {
            return []
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