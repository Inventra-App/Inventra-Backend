const cron = require('node-cron');
const {getExpiringProducts} = require('../services/expiryChecker');

const startExpiryJob = () => {
    // Runs every day at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
        console.log('Running product expiry check...');

        try {
            await checkExpiringProducts();
            console.log('Expiry check completed.');
        } catch (error) {
            console.error('Expiry job failed:', error.message);
        }
    });
};

module.exports = startExpiryJob;