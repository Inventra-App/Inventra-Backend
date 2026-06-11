const router = require('express').Router();

const { getTotalStockUnits, getTotalProducts } = require('../controllers/dashboardController')

router.get('/dashboard/tsu', getTotalStockUnits)
router.get('/dasboard/gtp', getTotalProducts)

module.exports = router