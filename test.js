// // const checkExpiringProducts = async () => {
// //     try {
// //         const today = new Date();

// //         const twoMonthsFromNow = new Date(today);
// //         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

// //         const batches = await BatchModel.find({
// //             expiryDate: {
// //                 $gte: today,
// //                 $lte: twoMonthsFromNow
// //             }
// //         })
// //         .populate('inventoryId')
// //         .populate('productId');

// //         if (!batches.length) {
// //             return [];
// //         }

// //         for (const batch of batches) {
// //             const expiryDate = new Date(batch.expiryDate);

// //             const daysLeft = Math.ceil(
// //                 (expiryDate - today) / (1000 * 60 * 60 * 24)
// //             );

// //             let level = ['EXPIRED', 'WARNING', 'INFO']
// //             let urgencyLevel;

            
// //             if (daysLeft <= 0 || daysLeft <= 7) {rgencyLevel = level[0]}
// //             else if (daysLeft >= 4 && daysLeft <= 7) {urgencyLevel = level[1]}
// //             else if (daysLeft >= 8 && daysLeft <= 14) {urgencyLevel = level[2]}
// //             // return urgencyLevel
// //             // else if (daysLeft <= 30) urgencyLevel = 'WARNING';

// //             const product = await ProductModel.findById(batch.productId)
// //             console.log({
// //                 product: product.productName,
// //                 batchCode: batch.batchCode,
// //                 quantityRemaining: batch.quantityRemaining,
// //                 expiresIn: `${daysLeft} days`,
// //                 urgency: urgencyLevel
// //             });

// //             await brevo(
// //     process.env.ADMIN_EMAIL,
// //     "Admin",
// //     `
// //     <h2>Expiry Alert</h2>
// //     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
// //     <p>Batch Code: ${batch.batchCode}</p>
// //     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
// //     <p>Expiry Date: ${expiryDate.toDateString()}</p>
// //     <p>Days Left: ${daysLeft}</p>
// //     <p>Urgency Level: ${urgencyLevel}</p>
// //     `
// // );
// //         }

// //         return batches;

// //     } catch (error) {
// //         console.log(error.message);
// //         throw error;
// //     }
// // };

// // module.exports = { checkExpiringProducts };



// // exports.checkExpiringProducts = async () => {
// //     try {
// //         const today = new Date();

// //         const twoMonthsFromNow = new Date(today);
// //         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

// //         const batches = await BatchModel.find({
// //             expiryDate: {
// //                 $gte: today,
// //                 $lte: twoMonthsFromNow
// //             }
// //         })
// //         .populate('inventoryId')
// //         .populate('productId');

// //         if (!batches.length) {
// //             return [];
// //         }

// //         for (const batch of batches) {
// //             const expiryDate = new Date(batch.expiryDate);

// //             const daysLeft = Math.ceil(
// //                 (expiryDate - today) / (1000 * 60 * 60 * 24)
// //             );

// //             let urgencyLevel = 'NOTICE';

            
// //             if (daysLeft <= 0) urgencyLevel = 'EXPIRED';
// //             else if (daysLeft >= 1 && daysLeft <= 7) urgencyLevel = 'CRITICAL';
// //             else if (daysLeft <= 14) urgencyLevel = 'URGENT';
// //             else if (daysLeft <= 30) urgencyLevel = 'WARNING';

// //             console.log({
// //                 product: batch.productId?.name || 'Unknown Product',
// //                 batchCode: batch.batchCode,
// //                 quantityRemaining: batch.quantityRemaining,
// //                 expiresIn: `${daysLeft} days`,
// //                 urgency: urgencyLevel
// //             });



// //             await brevo(
// //     process.env.ADMIN_EMAIL,
// //     "Admin",
// //     `
// //     <h2>Expiry Alert</h2>
// //     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
// //     <p>Batch Code: ${batch.batchCode}</p>
// //     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
// //     <p>Expiry Date: ${expiryDate.toDateString()}</p>
// //     <p>Days Left: ${daysLeft}</p>
// //     <p>Urgency Level: ${urgencyLevel}</p>
// //     `
// // );
// //         }

// //         return batches;

// //     } catch (error) {
// //         console.log(error.message);
// //         throw error;
// //     }
// // };




// // let expiringProductsCache = [];

// // exports.checkExpiringProducts = async () => {
// //     try {
// //         const today = new Date();

// //         const twoMonthsFromNow = new Date(today);
// //         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

// //         const batches = await BatchModel.find({
// //             expiryDate: {
// //                 $gte: today,
// //                 $lte: twoMonthsFromNow
// //             }
// //         })
// //         .populate('inventoryId')
// //         .populate('productId');

// //         if (!batches.length) {
// //             return [];
// //         }

// //         expiringProductsCache = batches.map(batch => {
// //             const expiryDate = new Date(batch.expiryDate);

// //             const daysLeft = Math.ceil(
// //                 (expiryDate - today) / (1000 * 60 * 60 * 24)
// //             );

// //           let urgencyLevel = 'SAFE';

// //         if (daysLeft <= 3) urgencyLevel = 'EXPIRED';
// //         else if (daysLeft <= 7) urgencyLevel = 'WARNING';
// //         else if (daysLeft <= 14) urgencyLevel = 'INFO';

// //             // console.log(
// //             //    { productId: batch.productId?._id,
// //             //     productName: batch.productId?.productName || 'Unknown Product',
// //             //     batchCode: batch.batchCode,
// //             //     quantityRemaining: batch.quantityRemaining,
// //             //     expiryDate,
// //             //     daysLeft,
// //             //     urgencyLevel,
// //             //     inventory: {
// //             //         totalStock: batch.inventoryId?.totalStock,
// //             //         availableStock: batch.inventoryId?.availableStock,
// //             //         reservedStock: batch.inventoryId?.reservedStock
// //             //     }}
// //             // )
// //             console.log(this.expiringProductsCache)
// //             return {
// //                 productId: batch.productId?._id,
// //                 productName: batch.productId?.productName || 'Unknown Product',
// //                 batchCode: batch.batchCode,
// //                 quantityRemaining: batch.quantityRemaining,
// //                 expiryDate,
// //                 daysLeft,
// //                 urgencyLevel,
// //                 inventory: {
// //                     totalStock: batch.inventoryId?.totalStock,
// //                     availableStock: batch.inventoryId?.availableStock,
// //                     reservedStock: batch.inventoryId?.reservedStock
// //                 }
// //             };
// //         });

// //     } catch (error) {
// //         console.log(error.message);
// //         throw error;
// //     }
// // };

// // const checkExpiringProducts = async () => {
// //     try {
// //         const today = new Date();

// //         const twoMonthsFromNow = new Date(today);
// //         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

// //         const batches = await BatchModel.find({
// //             expiryDate: {
// //                 $gte: today,
// //                 $lte: twoMonthsFromNow
// //             }
// //         })
// //         .populate('inventoryId')
// //         .populate('productId');

// //         if (!batches.length) {
// //             return [];
// //         }

// //         for (const batch of batches) {
// //             const expiryDate = new Date(batch.expiryDate);

// //             const daysLeft = Math.ceil(
// //                 (expiryDate - today) / (1000 * 60 * 60 * 24)
// //             );

// //             let level = ['EXPIRED', 'WARNING', 'INFO']
// //             let urgencyLevel;

            
// //             if (daysLeft <= 0 || daysLeft <= 7) {rgencyLevel = level[0]}
// //             else if (daysLeft >= 4 && daysLeft <= 7) {urgencyLevel = level[1]}
// //             else if (daysLeft >= 8 && daysLeft <= 14) {urgencyLevel = level[2]}
// //             // return urgencyLevel
// //             // else if (daysLeft <= 30) urgencyLevel = 'WARNING';

// //             const product = await ProductModel.findById(batch.productId)
// //             console.log({
// //                 product: product.productName,
// //                 batchCode: batch.batchCode,
// //                 quantityRemaining: batch.quantityRemaining,
// //                 expiresIn: `${daysLeft} days`,
// //                 urgency: urgencyLevel
// //             });

// //             await brevo(
// //     process.env.ADMIN_EMAIL,
// //     "Admin",
// //     `
// //     <h2>Expiry Alert</h2>
// //     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
// //     <p>Batch Code: ${batch.batchCode}</p>
// //     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
// //     <p>Expiry Date: ${expiryDate.toDateString()}</p>
// //     <p>Days Left: ${daysLeft}</p>
// //     <p>Urgency Level: ${urgencyLevel}</p>
// //     `
// // );
// //         }

// //         return batches;

// //     } catch (error) {
// //         console.log(error.message);
// //         throw error;
// //     }
// // };

// // module.exports = { checkExpiringProducts };



// // exports.checkExpiringProducts = async () => {
// //     try {
// //         const today = new Date();

// //         const twoMonthsFromNow = new Date(today);
// //         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

// //         const batches = await BatchModel.find({
// //             expiryDate: {
// //                 $gte: today,
// //                 $lte: twoMonthsFromNow
// //             }
// //         })
// //         .populate('inventoryId')
// //         .populate('productId');

// //         if (!batches.length) {
// //             return [];
// //         }

// //         for (const batch of batches) {
// //             const expiryDate = new Date(batch.expiryDate);

// //             const daysLeft = Math.ceil(
// //                 (expiryDate - today) / (1000 * 60 * 60 * 24)
// //             );

// //             let urgencyLevel = 'NOTICE';

            
// //             if (daysLeft <= 0) urgencyLevel = 'EXPIRED';
// //             else if (daysLeft >= 1 && daysLeft <= 7) urgencyLevel = 'CRITICAL';
// //             else if (daysLeft <= 14) urgencyLevel = 'URGENT';
// //             else if (daysLeft <= 30) urgencyLevel = 'WARNING';

// //             console.log({
// //                 product: batch.productId?.name || 'Unknown Product',
// //                 batchCode: batch.batchCode,
// //                 quantityRemaining: batch.quantityRemaining,
// //                 expiresIn: `${daysLeft} days`,
// //                 urgency: urgencyLevel
// //             });



// //             await brevo(
// //     process.env.ADMIN_EMAIL,
// //     "Admin",
// //     `
// //     <h2>Expiry Alert</h2>
// //     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
// //     <p>Batch Code: ${batch.batchCode}</p>
// //     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
// //     <p>Expiry Date: ${expiryDate.toDateString()}</p>
// //     <p>Days Left: ${daysLeft}</p>
// //     <p>Urgency Level: ${urgencyLevel}</p>
// //     `
// // );
// //         }

// //         return batches;

// //     } catch (error) {
// //         console.log(error.message);
// //         throw error;
// //     }
// // };




// // let expiringProductsCache = [];

// // exports.checkExpiringProducts = async () => {
// //     try {
// //         const today = new Date();

// //         const twoMonthsFromNow = new Date(today);
// //         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

// //         const batches = await BatchModel.find({
// //             expiryDate: {
// //                 $gte: today,
// //                 $lte: twoMonthsFromNow
// //             }
// //         })
// //         .populate('inventoryId')
// //         .populate('productId');

// //         if (!batches.length) {
// //             return [];
// //         }

// //         expiringProductsCache = batches.map(batch => {
// //             const expiryDate = new Date(batch.expiryDate);

// //             const daysLeft = Math.ceil(
// //                 (expiryDate - today) / (1000 * 60 * 60 * 24)
// //             );

// //           let urgencyLevel = 'SAFE';

// //         if (daysLeft <= 3) urgencyLevel = 'EXPIRED';
// //         else if (daysLeft <= 7) urgencyLevel = 'WARNING';
// //         else if (daysLeft <= 14) urgencyLevel = 'INFO';

// //             // console.log(
// //             //    { productId: batch.productId?._id,
// //             //     productName: batch.productId?.productName || 'Unknown Product',
// //             //     batchCode: batch.batchCode,
// //             //     quantityRemaining: batch.quantityRemaining,
// //             //     expiryDate,
// //             //     daysLeft,
// //             //     urgencyLevel,
// //             //     inventory: {
// //             //         totalStock: batch.inventoryId?.totalStock,
// //             //         availableStock: batch.inventoryId?.availableStock,
// //             //         reservedStock: batch.inventoryId?.reservedStock
// //             //     }}
// //             // )
// //             console.log(this.expiringProductsCache)
// //             return {
// //                 productId: batch.productId?._id,
// //                 productName: batch.productId?.productName || 'Unknown Product',
// //                 batchCode: batch.batchCode,
// //                 quantityRemaining: batch.quantityRemaining,
// //                 expiryDate,
// //                 daysLeft,
// //                 urgencyLevel,
// //                 inventory: {
// //                     totalStock: batch.inventoryId?.totalStock,
// //                     availableStock: batch.inventoryId?.availableStock,
// //                     reservedStock: batch.inventoryId?.reservedStock
// //                 }
// //             };
// //         });

// //     } catch (error) {
// //         console.log(error.message);
// //         throw error;
// //     }
// // };

// const InventoryModel = require('../models/inventory');
// const { sendMail } = require('../helpers/brevo');

// // const checkLowStock = async () => {
// //     try {
// //         const LOW_STOCK_LIMIT = 10;

// //         return await InventoryModel.find({
// //             availableStock: { $lte: LOW_STOCK_LIMIT }
// //         }).populate('productId');

// //         if (!lowStockItems.length) {
// //             console.log('No low stock products found.');
// //             return [];
// //         }

// //         for (const item of lowStockItems) {
// //             let stockLevel = 'LOW';

// //             if (item.availableStock <= 5) {
// //                 stockLevel = 'CRITICAL';
// //             }

// //             console.log({
// //                 product: item.productId.name,
// //                 totalStock: item.totalStock,
// //                 availableStock: item.availableStock,
// //                 reservedStock: item.reservedStock,
// //                 stockLevel
// //             });

// //             await sendMail({
// //                 to: process.env.ADMIN_EMAIL,
// //                 subject: `Low Stock Alert - ${item.productId.name}`,
// //                 text: `
// //             Product: ${item.productId.name}
// //             Category: ${item.categoryName}
// //             Total Stock: ${item.totalStock}
// //             Available Stock: ${item.availableStock}
// //             Reserved Stock: ${item.reservedStock}
// //             Stock Level: ${stockLevel}

// //          Please restock this product.
// //                 `
// //             });
// //         }

// //         return lowStockItems;

// //     } catch (error) {
// //         console.log(error);
// //          throw error;
// //     }
// // };

// // module.exports = {checkLowStock};



// // const InventoryModel = require('../models/inventory');
// // const { sendMail } = require('../helpers/brevo');

// let lowStockCache = [];

// const checkLowStock = async () => {
//     try {
//         const LOW_STOCK_LIMIT = 10;

//         const lowStockItems = await InventoryModel.find({
//             totalStock: { $lte: LOW_STOCK_LIMIT }
//         }).populate('productId');

//         if (!lowStockItems.length) {
//             console.log('No low stock products found.');
//             lowStockCache = [];
//             return [];
//         }

//         lowStockCache = lowStockItems.map(item => {
//             let stockLevel = 'LOW';

//             if (item.availableStock <= 5) {
//                 stockLevel = 'CRITICAL';
//             }

//             return {
//                 productId: item.productId?._id,
//                 productName: item.productId?.productName || 'Unknown Product',
//                 categoryName: item.categoryName,
//                 totalStock: item.totalStock,
//                 availableStock: item.availableStock,
//                 reservedStock: item.reservedStock,
//                 stockLevel
//             };
//         });

//         console.log(lowStockCache);

// //         for (const item of lowStockCache) {
// //             await sendMail({
// //                 to: process.env.ADMIN_EMAIL,
// //                 subject: `Low Stock Alert - ${item.productName}`,
// //                 text: `
// // Product: ${item.productName}
// // Category: ${item.categoryName}
// // Total Stock: ${item.totalStock}
// // Available Stock: ${item.availableStock}
// // Reserved Stock: ${item.reservedStock}
// // Stock Level: ${item.stockLevel}

// // Please restock this product.
// //                 `
// //             });
// //         }

//         return lowStockCache;

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };

// const getLowStock = () => {
//     return lowStockCache;
// };

// module.exports = {
//     checkLowStock,
//     getLowStock
// };


const info = [
    {
        name: 'hello Kitty',
        quantity: 21
    },
    {
        name: 'hello Kitty',
        quantity: 23 
    },
    {
        name: 'hello Kitty',
        quantity: 25 
    },
    {
        name: 'hello Kitty',
        quantity: 27 
    },
    {
        name: 'hello Kitty',
        quantity: 29 
    }
]

let sellInfo = info.map(e => e.quantity)
let reduceInfo = sellInfo.reduce((acc, curr) => acc + curr, 0)

console.log(reduceInfo)

console.log(sellInfo)

const sell = (quantity) => {
    if (quantity <= 0) {
        console.log('low input')
    } else {
        for (let i = 0; i < sellInfo.length; i++) {
            if (sellInfo[i] <= quantity) {
                console.log('hello')
                const lo = quantity - sellInfo[i];
                const ol = sellInfo[i] - ol;
                sellInfo[i] - ol;
                continue;
            } else if (sellInfo[i] > quantity) {
                reduceInfo -= quantity;
                sellInfo[i] -= quantity;
                break;
            }
        }
    }
        console.log(reduceInfo)
        console.log(sellInfo)
}
sell(24)