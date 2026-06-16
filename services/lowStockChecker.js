const InventoryModel = require('../models/inventory');
const { sendMail } = require('../helpers/brevo');

// const checkLowStock = async () => {
//     try {
//         const LOW_STOCK_LIMIT = 10;

//         return await InventoryModel.find({
//             availableStock: { $lte: LOW_STOCK_LIMIT }
//         }).populate('productId');

//         if (!lowStockItems.length) {
//             console.log('No low stock products found.');
//             return [];
//         }

//         for (const item of lowStockItems) {
//             let stockLevel = 'LOW';

//             if (item.availableStock <= 5) {
//                 stockLevel = 'CRITICAL';
//             }

//             console.log({
//                 product: item.productId.name,
//                 totalStock: item.totalStock,
//                 availableStock: item.availableStock,
//                 reservedStock: item.reservedStock,
//                 stockLevel
//             });

//             await sendMail({
//                 to: process.env.ADMIN_EMAIL,
//                 subject: `Low Stock Alert - ${item.productId.name}`,
//                 text: `
//             Product: ${item.productId.name}
//             Category: ${item.categoryName}
//             Total Stock: ${item.totalStock}
//             Available Stock: ${item.availableStock}
//             Reserved Stock: ${item.reservedStock}
//             Stock Level: ${stockLevel}

//          Please restock this product.
//                 `
//             });
//         }

//         return lowStockItems;

//     } catch (error) {
//         console.log(error);
//          throw error;
//     }
// };

// module.exports = {checkLowStock};



// const InventoryModel = require('../models/inventory');
// const { sendMail } = require('../helpers/brevo');

let lowStockCache = [];

const checkLowStock = async () => {
    try {
        const LOW_STOCK_LIMIT = 10;

        const lowStockItems = await InventoryModel.find({
            availableStock: { $lte: LOW_STOCK_LIMIT }
        }).populate('productId');

        if (!lowStockItems.length) {
            console.log('No low stock products found.');
            lowStockCache = [];
            return [];
        }

        lowStockCache = lowStockItems.map(item => {
            let stockLevel = 'LOW';

            if (item.availableStock <= 5) {
                stockLevel = 'CRITICAL';
            }

            return {
                productId: item.productId?._id,
                productName: item.productId?.productName || 'Unknown Product',
                categoryName: item.categoryName,
                totalStock: item.totalStock,
                availableStock: item.availableStock,
                reservedStock: item.reservedStock,
                stockLevel
            };
        });

        console.log(lowStockCache);

//         for (const item of lowStockCache) {
//             await sendMail({
//                 to: process.env.ADMIN_EMAIL,
//                 subject: `Low Stock Alert - ${item.productName}`,
//                 text: `
// Product: ${item.productName}
// Category: ${item.categoryName}
// Total Stock: ${item.totalStock}
// Available Stock: ${item.availableStock}
// Reserved Stock: ${item.reservedStock}
// Stock Level: ${item.stockLevel}

// Please restock this product.
//                 `
//             });
//         }

        return lowStockCache;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

const getLowStock = () => {
    return lowStockCache;
};

module.exports = {
    checkLowStock,
    getLowStock
};