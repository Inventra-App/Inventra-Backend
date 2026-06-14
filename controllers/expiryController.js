const { checkExpiringProducts } = require('../services/expiryChecker');

exports.getExpiringProducts = async (req, res, next) => {
    try {
        const data = await checkExpiringProducts();

        if (!data.length) {
            return res.status(404).json({
                message: 'No products nearing expiry'
            });
        }

        res.status(200).json({
            message: 'Expiring products checked successfully',
            data
        });

    } catch (error) {
        next(error);
    }
};