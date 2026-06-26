const cron = require('node-cron');
const { checkLowStock } = require('../services/lowStockChecker');
const SupermarketModel = require('../models/supermarket');

const startLowStockJob = () => {
    cron.schedule('*/10 * * * *', async () => {
        console.log('Running low stock check...');

        try {
            const supermarkets = await SupermarketModel.find({}, '_id');

            // OPTIMIZATION: Process all supermarkets in parallel instead of sequentially
            const results = await Promise.allSettled(
                supermarkets.map(supermarket => checkLowStock(supermarket._id))
            );

            // Log any failures
            const failures = results.filter(result => result.status === 'rejected');
            if (failures.length > 0) {
                console.error(`${failures.length} supermarket(s) failed low stock check:`, 
                    failures.map(f => f.reason?.message).filter(Boolean));
            }

            console.log(`Low stock check completed for ${supermarkets.length} supermarket(s).`);
        } catch (error) {
            console.error('Low stock job failed:', error.message);
        }
    });
};

module.exports = startLowStockJob;