// const checkExpiringProducts = async () => {
//     try {
//         const today = new Date();

//         const twoMonthsFromNow = new Date(today);
//         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

//         const batches = await BatchModel.find({
//             expiryDate: {
//                 $gte: today,
//                 $lte: twoMonthsFromNow
//             }
//         })
//         .populate('inventoryId')
//         .populate('productId');

//         if (!batches.length) {
//             return [];
//         }

//         for (const batch of batches) {
//             const expiryDate = new Date(batch.expiryDate);

//             const daysLeft = Math.ceil(
//                 (expiryDate - today) / (1000 * 60 * 60 * 24)
//             );

//             let level = ['EXPIRED', 'WARNING', 'INFO']
//             let urgencyLevel;

            
//             if (daysLeft <= 0 || daysLeft <= 7) {rgencyLevel = level[0]}
//             else if (daysLeft >= 4 && daysLeft <= 7) {urgencyLevel = level[1]}
//             else if (daysLeft >= 8 && daysLeft <= 14) {urgencyLevel = level[2]}
//             // return urgencyLevel
//             // else if (daysLeft <= 30) urgencyLevel = 'WARNING';

//             const product = await ProductModel.findById(batch.productId)
//             console.log({
//                 product: product.productName,
//                 batchCode: batch.batchCode,
//                 quantityRemaining: batch.quantityRemaining,
//                 expiresIn: `${daysLeft} days`,
//                 urgency: urgencyLevel
//             });

//             await brevo(
//     process.env.ADMIN_EMAIL,
//     "Admin",
//     `
//     <h2>Expiry Alert</h2>
//     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
//     <p>Batch Code: ${batch.batchCode}</p>
//     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
//     <p>Expiry Date: ${expiryDate.toDateString()}</p>
//     <p>Days Left: ${daysLeft}</p>
//     <p>Urgency Level: ${urgencyLevel}</p>
//     `
// );
//         }

//         return batches;

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };

// module.exports = { checkExpiringProducts };



// exports.checkExpiringProducts = async () => {
//     try {
//         const today = new Date();

//         const twoMonthsFromNow = new Date(today);
//         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

//         const batches = await BatchModel.find({
//             expiryDate: {
//                 $gte: today,
//                 $lte: twoMonthsFromNow
//             }
//         })
//         .populate('inventoryId')
//         .populate('productId');

//         if (!batches.length) {
//             return [];
//         }

//         for (const batch of batches) {
//             const expiryDate = new Date(batch.expiryDate);

//             const daysLeft = Math.ceil(
//                 (expiryDate - today) / (1000 * 60 * 60 * 24)
//             );

//             let urgencyLevel = 'NOTICE';

            
//             if (daysLeft <= 0) urgencyLevel = 'EXPIRED';
//             else if (daysLeft >= 1 && daysLeft <= 7) urgencyLevel = 'CRITICAL';
//             else if (daysLeft <= 14) urgencyLevel = 'URGENT';
//             else if (daysLeft <= 30) urgencyLevel = 'WARNING';

//             console.log({
//                 product: batch.productId?.name || 'Unknown Product',
//                 batchCode: batch.batchCode,
//                 quantityRemaining: batch.quantityRemaining,
//                 expiresIn: `${daysLeft} days`,
//                 urgency: urgencyLevel
//             });



//             await brevo(
//     process.env.ADMIN_EMAIL,
//     "Admin",
//     `
//     <h2>Expiry Alert</h2>
//     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
//     <p>Batch Code: ${batch.batchCode}</p>
//     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
//     <p>Expiry Date: ${expiryDate.toDateString()}</p>
//     <p>Days Left: ${daysLeft}</p>
//     <p>Urgency Level: ${urgencyLevel}</p>
//     `
// );
//         }

//         return batches;

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };




// let expiringProductsCache = [];

// exports.checkExpiringProducts = async () => {
//     try {
//         const today = new Date();

//         const twoMonthsFromNow = new Date(today);
//         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

//         const batches = await BatchModel.find({
//             expiryDate: {
//                 $gte: today,
//                 $lte: twoMonthsFromNow
//             }
//         })
//         .populate('inventoryId')
//         .populate('productId');

//         if (!batches.length) {
//             return [];
//         }

//         expiringProductsCache = batches.map(batch => {
//             const expiryDate = new Date(batch.expiryDate);

//             const daysLeft = Math.ceil(
//                 (expiryDate - today) / (1000 * 60 * 60 * 24)
//             );

//           let urgencyLevel = 'SAFE';

//         if (daysLeft <= 3) urgencyLevel = 'EXPIRED';
//         else if (daysLeft <= 7) urgencyLevel = 'WARNING';
//         else if (daysLeft <= 14) urgencyLevel = 'INFO';

//             // console.log(
//             //    { productId: batch.productId?._id,
//             //     productName: batch.productId?.productName || 'Unknown Product',
//             //     batchCode: batch.batchCode,
//             //     quantityRemaining: batch.quantityRemaining,
//             //     expiryDate,
//             //     daysLeft,
//             //     urgencyLevel,
//             //     inventory: {
//             //         totalStock: batch.inventoryId?.totalStock,
//             //         availableStock: batch.inventoryId?.availableStock,
//             //         reservedStock: batch.inventoryId?.reservedStock
//             //     }}
//             // )
//             console.log(this.expiringProductsCache)
//             return {
//                 productId: batch.productId?._id,
//                 productName: batch.productId?.productName || 'Unknown Product',
//                 batchCode: batch.batchCode,
//                 quantityRemaining: batch.quantityRemaining,
//                 expiryDate,
//                 daysLeft,
//                 urgencyLevel,
//                 inventory: {
//                     totalStock: batch.inventoryId?.totalStock,
//                     availableStock: batch.inventoryId?.availableStock,
//                     reservedStock: batch.inventoryId?.reservedStock
//                 }
//             };
//         });

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };

// const checkExpiringProducts = async () => {
//     try {
//         const today = new Date();

//         const twoMonthsFromNow = new Date(today);
//         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

//         const batches = await BatchModel.find({
//             expiryDate: {
//                 $gte: today,
//                 $lte: twoMonthsFromNow
//             }
//         })
//         .populate('inventoryId')
//         .populate('productId');

//         if (!batches.length) {
//             return [];
//         }

//         for (const batch of batches) {
//             const expiryDate = new Date(batch.expiryDate);

//             const daysLeft = Math.ceil(
//                 (expiryDate - today) / (1000 * 60 * 60 * 24)
//             );

//             let level = ['EXPIRED', 'WARNING', 'INFO']
//             let urgencyLevel;

            
//             if (daysLeft <= 0 || daysLeft <= 7) {rgencyLevel = level[0]}
//             else if (daysLeft >= 4 && daysLeft <= 7) {urgencyLevel = level[1]}
//             else if (daysLeft >= 8 && daysLeft <= 14) {urgencyLevel = level[2]}
//             // return urgencyLevel
//             // else if (daysLeft <= 30) urgencyLevel = 'WARNING';

//             const product = await ProductModel.findById(batch.productId)
//             console.log({
//                 product: product.productName,
//                 batchCode: batch.batchCode,
//                 quantityRemaining: batch.quantityRemaining,
//                 expiresIn: `${daysLeft} days`,
//                 urgency: urgencyLevel
//             });

//             await brevo(
//     process.env.ADMIN_EMAIL,
//     "Admin",
//     `
//     <h2>Expiry Alert</h2>
//     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
//     <p>Batch Code: ${batch.batchCode}</p>
//     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
//     <p>Expiry Date: ${expiryDate.toDateString()}</p>
//     <p>Days Left: ${daysLeft}</p>
//     <p>Urgency Level: ${urgencyLevel}</p>
//     `
// );
//         }

//         return batches;

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };

// module.exports = { checkExpiringProducts };



// exports.checkExpiringProducts = async () => {
//     try {
//         const today = new Date();

//         const twoMonthsFromNow = new Date(today);
//         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

//         const batches = await BatchModel.find({
//             expiryDate: {
//                 $gte: today,
//                 $lte: twoMonthsFromNow
//             }
//         })
//         .populate('inventoryId')
//         .populate('productId');

//         if (!batches.length) {
//             return [];
//         }

//         for (const batch of batches) {
//             const expiryDate = new Date(batch.expiryDate);

//             const daysLeft = Math.ceil(
//                 (expiryDate - today) / (1000 * 60 * 60 * 24)
//             );

//             let urgencyLevel = 'NOTICE';

            
//             if (daysLeft <= 0) urgencyLevel = 'EXPIRED';
//             else if (daysLeft >= 1 && daysLeft <= 7) urgencyLevel = 'CRITICAL';
//             else if (daysLeft <= 14) urgencyLevel = 'URGENT';
//             else if (daysLeft <= 30) urgencyLevel = 'WARNING';

//             console.log({
//                 product: batch.productId?.name || 'Unknown Product',
//                 batchCode: batch.batchCode,
//                 quantityRemaining: batch.quantityRemaining,
//                 expiresIn: `${daysLeft} days`,
//                 urgency: urgencyLevel
//             });



//             await brevo(
//     process.env.ADMIN_EMAIL,
//     "Admin",
//     `
//     <h2>Expiry Alert</h2>
//     <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
//     <p>Batch Code: ${batch.batchCode}</p>
//     <p>Quantity Remaining: ${batch.quantityRemaining}</p>
//     <p>Expiry Date: ${expiryDate.toDateString()}</p>
//     <p>Days Left: ${daysLeft}</p>
//     <p>Urgency Level: ${urgencyLevel}</p>
//     `
// );
//         }

//         return batches;

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };




// let expiringProductsCache = [];

// exports.checkExpiringProducts = async () => {
//     try {
//         const today = new Date();

//         const twoMonthsFromNow = new Date(today);
//         twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

//         const batches = await BatchModel.find({
//             expiryDate: {
//                 $gte: today,
//                 $lte: twoMonthsFromNow
//             }
//         })
//         .populate('inventoryId')
//         .populate('productId');

//         if (!batches.length) {
//             return [];
//         }

//         expiringProductsCache = batches.map(batch => {
//             const expiryDate = new Date(batch.expiryDate);

//             const daysLeft = Math.ceil(
//                 (expiryDate - today) / (1000 * 60 * 60 * 24)
//             );

//           let urgencyLevel = 'SAFE';

//         if (daysLeft <= 3) urgencyLevel = 'EXPIRED';
//         else if (daysLeft <= 7) urgencyLevel = 'WARNING';
//         else if (daysLeft <= 14) urgencyLevel = 'INFO';

//             // console.log(
//             //    { productId: batch.productId?._id,
//             //     productName: batch.productId?.productName || 'Unknown Product',
//             //     batchCode: batch.batchCode,
//             //     quantityRemaining: batch.quantityRemaining,
//             //     expiryDate,
//             //     daysLeft,
//             //     urgencyLevel,
//             //     inventory: {
//             //         totalStock: batch.inventoryId?.totalStock,
//             //         availableStock: batch.inventoryId?.availableStock,
//             //         reservedStock: batch.inventoryId?.reservedStock
//             //     }}
//             // )
//             console.log(this.expiringProductsCache)
//             return {
//                 productId: batch.productId?._id,
//                 productName: batch.productId?.productName || 'Unknown Product',
//                 batchCode: batch.batchCode,
//                 quantityRemaining: batch.quantityRemaining,
//                 expiryDate,
//                 daysLeft,
//                 urgencyLevel,
//                 inventory: {
//                     totalStock: batch.inventoryId?.totalStock,
//                     availableStock: batch.inventoryId?.availableStock,
//                     reservedStock: batch.inventoryId?.reservedStock
//                 }
//             };
//         });

//     } catch (error) {
//         console.log(error.message);
//         throw error;
//     }
// };

