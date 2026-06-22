const { checkLowStock } = require('../services/lowStockChecker');
const { filterRole } = require('../helpers/helpers');

exports.getLowStock = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        const supermarketId = await filterRole(id, role);

        const data = await checkLowStock(supermarketId);

        if (!data.length) {
            return [];
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