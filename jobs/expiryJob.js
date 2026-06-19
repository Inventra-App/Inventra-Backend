const cron = require('node-cron');
const { checkExpiringProducts } = require('../services/expiryChecker');
const SupermarketModel = require('../models/supermarket');

const startExpiryJob = () => {
    cron.schedule('*/10 * * * *', async () => {
        console.log('Running product expiry check...');

        try {
            const supermarkets = await SupermarketModel.find({}, '_id');

            for (const supermarket of supermarkets) {
                await checkExpiringProducts(supermarket._id);
            }

            console.log('Expiry check completed.');
        } catch (error) {
            console.error('Expiry job failed:', error.message);
        }
    });
};

module.exports = startExpiryJob;