const router = require('express').Router();

const { createCategory } = require('../controllers/categoryConroller');
const {authentication} = require('../middlewares/auth')

router.post('/category', authentication, createCategory);

module.exports = router;