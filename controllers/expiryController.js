const { checkExpiringProducts } = require('../services/expiryChecker');
const { filterRole } = require('../helpers/helpers');

exports.fetchExpiringProducts = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        const supermarketId = await filterRole(id, role);

        const products = await checkExpiringProducts(supermarketId);

        res.status(200).json({
            message: 'Expiring products fetched successfully',
            count: products.length,
            data: products
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};