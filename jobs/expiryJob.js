const cron = require('node-cron');
const {checkExpiringProducts} = require('../services/expiryChecker');

const startExpiryJob = () => {
    cron.schedule('*/60 * * * * *', async () => {
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

