const BatchModel = require('../models/batch');
require('dotenv').config();
const { brevo } = require('../helpers/brevo');
const ProductModel = require('../models/product');

let expiringProductsCache = [];

exports.checkExpiringProducts = async () => {
    try {
        const today = new Date();

        const twoMonthsFromNow = new Date(today);
        twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

        const batches = await BatchModel.find({
            expiryDate: {
                $gte: today,
                $lte: twoMonthsFromNow
            }
        })
        .populate('inventoryId')
        .populate('productId');

        if (!batches.length) {
            expiringProductsCache = [];
            return [];
        }

        expiringProductsCache = batches.map(batch => {
            const expiryDate = new Date(batch.expiryDate);
            console.log(expiryDate)

            const daysLeft = Math.ceil( 
                (expiryDate - today) / (1000 * 60 * 60 * 24)
            );
            console.log(daysLeft)

            let urgencyLevel = 'SAFE';

            if (daysLeft < 0) urgencyLevel = 'EXPIRED';
            else if (daysLeft <= 7) urgencyLevel = 'WARNING';
            else if (daysLeft <= 14) urgencyLevel = 'INFO';

            console.log({
                productId: batch.productId?._id,
                productName: batch.productId?.productName || 'Unknown Product',
                batchCode: batch.batchCode,
                quantityRemaining: batch.quantityRemaining,
                expiryDate,
                daysLeft,
                urgencyLevel,
                inventory: {
                    totalStock: batch.inventoryId?.totalStock || 0,
                    availableStock: batch.inventoryId?.availableStock || 0,
                    reservedStock: batch.inventoryId?.reservedStock || 0
                }
            })

            return {
                productId: batch.productId?._id,
                productName: batch.productId?.productName || 'Unknown Product',
                batchCode: batch.batchCode,
                quantityRemaining: batch.quantityRemaining,
                expiryDate,
                daysLeft,
                urgencyLevel,
                inventory: {
                    totalStock: batch.inventoryId?.totalStock || 0,
                    availableStock: batch.inventoryId?.availableStock || 0,
                    reservedStock: batch.inventoryId?.reservedStock || 0
                }
            };
        });

        console.log(expiringProductsCache);

        return expiringProductsCache;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

exports.getExpiringProducts = () => {
    return expiringProductsCache;
};