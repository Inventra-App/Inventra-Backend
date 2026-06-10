const router = require('express').Router()

const { addProducts } = require('../controllers/inventoryController');
const { authentication } = require('../middlewares/auth');

router.post('/product', authentication, addProducts);

module.exports = router