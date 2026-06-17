const { getExpiringProducts } = require('../services/expiryChecker');

exports.fetchExpiringProducts = async (req, res, next) => {
    try {
        const products = getExpiringProducts();

        res.status(200).json({
            message: 'Expiring products fetched successfully',
            count: products.length,
            data: products
        });

    } catch (error) {
        next(error);
    }
};