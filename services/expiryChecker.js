const BatchModel = require('../models/batch');
const { sendMail } = require('../helpers/brevo');

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

            if (daysLeft <= 7) urgencyLevel = 'CRITICAL';
            else if (daysLeft <= 14) urgencyLevel = 'URGENT';
            else if (daysLeft <= 30) urgencyLevel = 'WARNING';

            console.log({
                product: batch.productId?.name || 'Unknown Product',
                batchCode: batch.batchCode,
                quantityRemaining: batch.quantityRemaining,
                expiresIn: `${daysLeft} days`,
                urgency: urgencyLevel
            });

            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `Expiry Alert - ${batch.productId?.name || 'Unknown Product'}`,
                text: `
            Product: ${batch.productId?.name || 'Unknown Product'}
            Batch Code: ${batch.batchCode}
            Quantity Remaining: ${batch.quantityRemaining}
            Expiry Date: ${expiryDate.toDateString()}
            Days Left: ${daysLeft}
            Urgency Level: ${urgencyLevel}
                `
            });
        }

        return batches;

    } catch (error) {
        console.log(error);
        throw error;
    }
};

module.exports = { checkExpiringProducts };