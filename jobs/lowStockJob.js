const cron = require('node-cron');
const { checkLowStock } = require('../services/lowStockChecker');

const startLowStockJob = () => {
    cron.schedule('*/60 * * * * *', async () => {
        console.log('Running low stock check...');
        await checkLowStock();
    });
};

module.exports = startLowStockJob;

// cron.schedule('*/15 * * * * *', checkExpiringProducts);
