const cron = require('node-cron');
const { checkExpiringProducts } = require('../services/expiryChecker');

const startExpiryJob = () => {
    // this is to run evey 10 seconds
    cron.schedule('*/720 * * * * *', async () => {
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









// const cron = require('node-cron');
// const {getExpiringProducts} = require('../services/expiryChecker');

// const startExpiryJob = () => {
//     cron.schedule('0 8 * * *', async () => {
//         console.log('Running product expiry check...');

//         try {
//             await checkExpiringProducts();
//             console.log('Expiry check completed.');
//         } catch (error) {
//             console.error('Expiry job failed:', error.message);
//         }
//     });
// };

// module.exports = startExpiryJob;