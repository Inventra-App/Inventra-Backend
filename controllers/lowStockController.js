const { checkLowStock } = require('../services/lowStockChecker');

exports.getLowStock = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        const supermarketId = await filterRole(id, role);

        const data = await checkLowStock(supermarketId);

        if (!data.length) {
            return res.status(404).json({
                message: 'No low stock products found'
            });
        }

        res.status(200).json({
            message: 'Low stock products fetched successfully',
            count: data.length,
            data
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};