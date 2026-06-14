const { checkLowStock } = require('../services/lowStockChecker');

exports.getLowStock = async (req, res, next) => {
    try {
        const data = await checkLowStock();

        if (!data.length) {
            return res.status(404).json({
                message: 'No low stock products found'
            });
        }

        res.status(200).json({
            message: 'Low stock products fetched successfully',
            data
        });

    } catch (error) {
        next(error);
    }
}