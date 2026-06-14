const InventoryModel = require('../models/inventory');
const { sendMail } = require('../helpers/brevo');

const checkLowStock = async () => {
    try {
        const LOW_STOCK_LIMIT = 10;

        return await InventoryModel.find({
            availableStock: { $lte: LOW_STOCK_LIMIT }
        }).populate('productId');

        if (!lowStockItems.length) {
            console.log('No low stock products found.');
            return [];
        }

        for (const item of lowStockItems) {
            let stockLevel = 'LOW';

            if (item.availableStock <= 5) {
                stockLevel = 'CRITICAL';
            }

            console.log({
                product: item.productId.name,
                totalStock: item.totalStock,
                availableStock: item.availableStock,
                reservedStock: item.reservedStock,
                stockLevel
            });

            await sendMail({
                to: process.env.ADMIN_EMAIL,
                subject: `Low Stock Alert - ${item.productId.name}`,
                text: `
            Product: ${item.productId.name}
            Category: ${item.categoryName}
            Total Stock: ${item.totalStock}
            Available Stock: ${item.availableStock}
            Reserved Stock: ${item.reservedStock}
            Stock Level: ${stockLevel}

         Please restock this product.
                `
            });
        }

        return lowStockItems;

    } catch (error) {
        console.log(error);
         throw error;
    }
};

module.exports = {checkLowStock};



