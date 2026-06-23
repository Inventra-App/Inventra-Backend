// const InventoryModel = require('../models/inventory');
// const ProductModel = require('../models/product');

// let lowStockCache = {};

// const checkLowStock = async (supermarketId) => {
//     try {
//         const LOW_STOCK_LIMIT = 10;

//         const lowStockItems = await InventoryModel.find({
//             supermarketId,
//             totalStock: { $lte: LOW_STOCK_LIMIT }
//         }).populate('productId');

//         if (!lowStockItems.length) {
//             lowStockCache[supermarketId] = [];
//             return [];
//         }

//         const productId = lowStockItems.find( product => product.productId )

//         const products = lowStockItems.map(async item => {
//             let stockLevel = 'LOW';

//             if (item.availableStock <= 5) {
//                 stockLevel = 'CRITICAL';
//             }

//             const product = await ProductModel.find({
//                 productId,
//                 supermarketId
//             })

//             console.log({
//                 productId: item.productId?._id,
//                 productName: product.productName,
//                 totalStock: item.totalStock,
//                 availableStock: item.availableStock,
//                 backroomStock: item.backroomStock,
//                 stockLevel
//             });
//             return {
//                 productId: item.productId?._id,
//                 productName: product.productName,
//                 totalStock: item.totalStock,
//                 availableStock: item.availableStock,
//                 backroomStock: item.backroomStock,
//                 stockLevel
//             };

//         });

//         lowStockCache[supermarketId] = products;

//         return products;

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };

// const getLowStock = (supermarketId) => {
//     return lowStockCache[supermarketId] || [];
// };

// module.exports = {
//     checkLowStock,
//     getLowStock
// };


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

        const products = await Promise.all(
            lowStockItems.map(async (item) => {
                let stockLevel = 'LOW';

                if (item.availableStock <= 5) {
                    stockLevel = 'CRITICAL';
                }

                const product = await ProductModel.findOne({
                    _id: item.productId._id,
                    supermarketId
                });

                console.log({
                    productId: item.productId?._id,
                    productName: product?.productName,
                    totalStock: item.totalStock,
                    availableStock: item.availableStock,
                    backroomStock: item.backroomStock,
                    stockLevel
                });

                return {
                    productId: item.productId?._id,
                    productName: product?.productName,
                    totalStock: item.totalStock,
                    availableStock: item.availableStock,
                    backroomStock: item.backroomStock,
                    stockLevel
                };
            })
        );

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