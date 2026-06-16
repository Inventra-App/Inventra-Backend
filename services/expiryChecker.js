const BatchModel = require('../models/batch');
require('dotenv').config();
const { brevo } = require('../helpers/brevo');

const checkExpiringProducts = async () => {
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
            return [];
        }

        for (const batch of batches) {
            const expiryDate = new Date(batch.expiryDate);

            const daysLeft = Math.ceil(
                (expiryDate - today) / (1000 * 60 * 60 * 24)
            ); 

            let urgencyLevel = 'NOTICE';

            
            if (daysLeft <= 0) urgencyLevel = 'EXPIRED';
            else if (daysLeft >= 1 && daysLeft <= 7) urgencyLevel = 'CRITICAL';
            else if (daysLeft <= 14) urgencyLevel = 'URGENT';
            else if (daysLeft <= 30) urgencyLevel = 'WARNING';

            console.log({
                product: batch.productId?.name || 'Unknown Product',
                batchCode: batch.batchCode,
                quantityRemaining: batch.quantityRemaining,
                expiresIn: `${daysLeft} days`,
                urgency: urgencyLevel
            });

            await brevo(
    process.env.ADMIN_EMAIL,
    "Admin",
    `
    <h2>Expiry Alert</h2>
    <p>Product: ${batch.productId?.name || 'Unknown Product'}</p>
    <p>Batch Code: ${batch.batchCode}</p>
    <p>Quantity Remaining: ${batch.quantityRemaining}</p>
    <p>Expiry Date: ${expiryDate.toDateString()}</p>
    <p>Days Left: ${daysLeft}</p>
    <p>Urgency Level: ${urgencyLevel}</p>
    `
);
        }

        return batches;

    } catch (error) {
        console.log(error.message);
        throw error;
    }
};

module.exports = { checkExpiringProducts };