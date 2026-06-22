const InventoryModel = require('../models/inventory');
const ProductModel = require('../models/product');

let lowStockCache = {};

const checkLowStock = async (supermarketId) => {
    try {
        const LOW_STOCK_LIMIT = 10;

        const lowStockItems = await InventoryModel.find({
            supermarketId,
            totalStock: { $lte: LOW_STOCK_LIMIT }
        }).populate('productId');

        if (!lowStockItems.length) {
            lowStockCache[supermarketId] = [];
            return [];
        }

        const product = await ProductModel.find({
            supermarketId
        })

        const products = lowStockItems.map(item => {
            let stockLevel = 'LOW';

            if (item.availableStock <= 5) {
                stockLevel = 'CRITICAL';
            }

            return {
                productId: item.productId?._id,
                productName: product.productName || 'Unknown Product',
                totalStock: item.totalStock,
                availableStock: item.availableStock,
                reservedStock: item.reservedStock,
                stockLevel
            };
        });

        lowStockCache[supermarketId] = products;

        return products;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

const getLowStock = (supermarketId) => {
    return lowStockCache[supermarketId] || [];
};

module.exports = {
    checkLowStock,
    getLowStock
};