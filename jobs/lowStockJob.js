const cron = require('node-cron');
const { checkLowStock } = require('../services/lowStockChecker');
const SupermarketModel = require('../models/supermarket');

const startLowStockJob = () => {
    cron.schedule('*/10 * * * *', async () => {
        console.log('Running low stock check...');

        try {
            const supermarkets = await SupermarketModel.find({}, '_id');

            for (const supermarket of supermarkets) {
                await checkLowStock(supermarket._id);
            }

            console.log('Low stock check completed.');
        } catch (error) {
            console.error('Low stock job failed:', error.message);
        }
    });
};

module.exports = startLowStockJob;