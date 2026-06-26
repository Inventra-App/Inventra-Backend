// ============================================
// OLD IMPLEMENTATION (SLOW) - COMMENTED OUT
// ============================================

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

//         const products = await Promise.all(
//             lowStockItems.map(async (item) => {
//                 let stockLevel = 'LOW';

//                 if (item.availableStock <= 5) {
//                     stockLevel = 'CRITICAL';
//                 }

//                 const product = await ProductModel.findOne({
//                     _id: item.productId._id,
//                     supermarketId
//                 });

//                 console.log({
//                     productId: item.productId?._id,
//                     productName: product?.productName,
//                     totalStock: item.totalStock,
//                     availableStock: item.availableStock,
//                     backroomStock: item.backroomStock,
//                     stockLevel
//                 });

//                 return {
//                     productId: item.productId?._id,
//                     productName: product?.productName,
//                     totalStock: item.totalStock,
//                     availableStock: item.availableStock,
//                     backroomStock: item.backroomStock,
//                     stockLevel
//                 };
//             })
//         );

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


// ============================================
// NEW IMPLEMENTATION (FAST) - OPTIMIZED
// ============================================

const InventoryModel = require('../models/inventory');
const ProductModel = require('../models/product');

let lowStockCache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in milliseconds
let cacheTimestamps = {};

/**
 * Optimized low stock checker with performance improvements:
 * 1. Uses populated data instead of redundant queries
 * 2. Queries on actual fields (availableStock) instead of virtual fields (totalStock)
 * 3. Removes excessive console.log
 * 4. Adds cache TTL for automatic invalidation
 * 5. Uses lean() for faster queries
 */
const checkLowStock = async (supermarketId) => {
    try {
        const LOW_STOCK_LIMIT = 10;
        const now = Date.now();

        // Check if cache is still valid
        if (lowStockCache[supermarketId] && 
            cacheTimestamps[supermarketId] && 
            (now - cacheTimestamps[supermarketId]) < CACHE_TTL) {
            return lowStockCache[supermarketId];
        }

        // OPTIMIZATION 1: Query on actual field (availableStock) instead of virtual field (totalStock)
        // This allows MongoDB to use indexes and avoids COLLSCAN
        const lowStockItems = await InventoryModel.find({
            supermarketId,
            availableStock: { $lte: LOW_STOCK_LIMIT }
        })
        .populate('productId', 'productName') // Only fetch needed fields
        .lean() // Faster, returns plain JS objects
        .exec();

        if (!lowStockItems.length) {
            lowStockCache[supermarketId] = [];
            cacheTimestamps[supermarketId] = now;
            return [];
        }

        // OPTIMIZATION 2: Use populated data instead of requerying Product collection
        const products = lowStockItems.map((item) => {
            let stockLevel = 'LOW';

            if (item.availableStock <= 5) {
                stockLevel = 'CRITICAL';
            }

            // Use populated productId data directly (no additional query!)
            return {
                productId: item.productId?._id,
                productName: item.productId?.productName,
                totalStock: item.availableStock + item.backroomStock,
                availableStock: item.availableStock,
                backroomStock: item.backroomStock,
                stockLevel
            };
        });

        // Update cache with timestamp
        lowStockCache[supermarketId] = products;
        cacheTimestamps[supermarketId] = now;

        return products;

    } catch (error) {
        console.error('Low stock check error:', error.message);
        throw error;
    }
};

/**
 * Get cached low stock data
 * @param {string} supermarketId - The supermarket ID
 * @returns {Array} Cached low stock products or empty array
 */
const getLowStock = (supermarketId) => {
    const now = Date.now();
    
    // Check if cache exists and is still valid
    if (lowStockCache[supermarketId] && 
        cacheTimestamps[supermarketId] && 
        (now - cacheTimestamps[supermarketId]) < CACHE_TTL) {
        return lowStockCache[supermarketId];
    }
    
    return [];
};

/**
 * Clear cache for a specific supermarket or all
 * @param {string} supermarketId - Optional: specific supermarket ID to clear
 */
const clearCache = (supermarketId = null) => {
    if (supermarketId) {
        delete lowStockCache[supermarketId];
        delete cacheTimestamps[supermarketId];
    } else {
        lowStockCache = {};
        cacheTimestamps = {};
    }
};

module.exports = {
    checkLowStock,
    getLowStock,
    clearCache
};