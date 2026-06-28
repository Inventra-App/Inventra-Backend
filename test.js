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

// exports.recordStockEntry = async (req, res, next) => {
//     try {
//         const { id, role } = req.user;

//         if (role !== 'admin' && role !== 'manager') {
//             return res.status(403).json({
//                 message: `You are not authorised to perform this action!`
//             })
//         };
//         const supermarketId = await filterRole(id, role);

//         const {
//             productId,
//             supplier,
//             expiryDate,
//             packageType,
//             packageQuantity,
//             unitPerPackage,
//             availableStock,
//             backroomStock,
//         } = req.body;

//         const totalIncomingStock = unitPerPackage * packageQuantity;

//         // Block invalid stock allocation
//         if ((availableStock + backroomStock) > totalIncomingStock) {
//             return res.status(400).json({
//                 message: `Allocated stock exceeds total incoming stock`
//             });
//         }

//         // Block incomplete allocation
//         if ((availableStock + backroomStock) < totalIncomingStock) {
//             return res.status(400).json({
//                 message: `Stock allocation is incomplete. Remaining ${
//                     totalIncomingStock - (availableStock + backroomStock)
//                 } units unallocated`
//             });
//         }



//         const inventoryItem = await InventoryModel.findOne({ productId: productId, supermarketId })
//         const previousStock = inventoryItem?.totalStock;
//         console.log(inventoryItem)
//         if (!inventoryItem) {
//             return res.status(404).json({
//                 message: `Product not found`
//             })
//         }
//         const checkProduct = await ProductModel.findOne({ _id: inventoryItem.productId, supermarketId })
//         const productCount = await BatchModel.countDocuments()
//         console.log(productCount)

//         const code = `${generateBatchCode()}${padStart(productCount)}`;
//         console.log(code)

//         const newBatch = new BatchModel({
//             supermarketId,
//             inventoryId: inventoryItem._id,
//             productId: inventoryItem.productId,
//             batchCode: code,
//             supplier,
//             quantity: totalIncomingStock,
//             quantityRemaining: totalIncomingStock,
//             unitCost: checkProduct.unitPrice,
//             expiryDate,
//             createdBy: id
//         })

//         console.log(newBatch)
//         await newBatch.save()
        
//         inventoryItem.totalStock += newBatch.quantity;
//         inventoryItem.availableStock += availableStock;
//         inventoryItem.backroomStock += backroomStock;

//         await inventoryItem.save()
        
//         await logActivity({
//             supermarket: supermarketId,
//             user: id,
//             title: 'Recorded delivery',
//             module: 'INVENTORY',
//             description: `Received ${totalIncomingStock} units of ${checkProduct.productName} from ${supplier}`,
//             entityId: newBatch._id
//         });

//         res.status(201).json({
//             message: `Done`,
//             data: {
//                 newBatch,
//                 product: inventoryItem, 
//                 success: {
//                     message: `Stock Entry: ${totalIncomingStock} units revieved from ${supplier}`,
//                     product: checkProduct.productName,
//                     previousStock,
//                     updatedStock: inventoryItem.totalStock,
//                     availableStock: inventoryItem.availableStock,
//                     backroomStock: inventoryItem.backroomStock
//                 }
//              }
//         })


//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// }


// FIFO BATCH DEDUCTION - ITERATIVE VERSION
// const batches = [
//     { batchCode: "BAT-001", quantityRemaining: 21, createdAt: "2026-01-01" },
//     { batchCode: "BAT-002", quantityRemaining: 23, createdAt: "2026-01-15" },
//     { batchCode: "BAT-003", quantityRemaining: 25, createdAt: "2026-02-01" },
//     { batchCode: "BAT-004", quantityRemaining: 27, createdAt: "2026-02-15" },
//     { batchCode: "BAT-005", quantityRemaining: 29, createdAt: "2026-03-01" },
// ];



// console.log("=== ITERATIVE FIFO ===");
// console.log("Before:", batches.map(b => `${b.batchCode}: ${b.quantityRemaining}`));
// console.log("Selling 24 units...");
// sellFifoIterative(24, batches);
// console.log("After:", batches.map(b => `${b.batchCode}: ${b.quantityRemaining}`));

// // FIFO BATCH DEDUCTION - RECURSIVE VERSION
// const resetBatches = () => [
//     { batchCode: "BAT-001", quantityRemaining: 21, createdAt: "2026-01-01" },
//     { batchCode: "BAT-002", quantityRemaining: 23, createdAt: "2026-01-15" },
//     { batchCode: "BAT-003", quantityRemaining: 25, createdAt: "2026-02-01" },
//     { batchCode: "BAT-004", quantityRemaining: 27, createdAt: "2026-02-15" },
//     { batchCode: "BAT-005", quantityRemaining: 29, createdAt: "2026-03-01" },
// ];

// const sellFifoRecursive = (quantityToSell, batchList, index = 0) => {
//     if (quantityToSell <= 0) {
//         console.log("Sale fulfilled!");
//         return batchList;
//     }
//     if (index >= batchList.length) {
//         console.log(`Short! Need ${quantityToSell} more units.`);
//         return batchList;
//     }
//     const batch = batchList[index];
//     if (batch.quantityRemaining <= quantityToSell) {
//         console.log(`Recursive full: ${batch.batchCode} (${batch.quantityRemaining} units)`);
//         const newRemaining = quantityToSell - batch.quantityRemaining;
//         batch.quantityRemaining = 0;
//         return sellFifoRecursive(newRemaining, batchList, index + 1);
//     } else {
//         console.log(`Recursive partial: ${batch.batchCode} deducted ${quantityToSell} units`);
//         batch.quantityRemaining -= quantityToSell;
//         return batchList;
//     }
// };

// console.log("=== RECURSIVE FIFO ===");
// const recBatches = resetBatches();
// console.log("Before:", recBatches.map(b => `${b.batchCode}: ${b.quantityRemaining}`));
// console.log("Selling 50 units...");
// sellFifoRecursive(50, recBatches);
// console.log("After:", recBatches.map(b => `${b.batchCode}: ${b.quantityRemaining}`));