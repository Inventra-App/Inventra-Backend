const router = require('express').Router()

const { signUp } = require('../controllers/userController');
const { signUpValidator } = require('../middlewares/validator');

router.post('/user', signUpValidator, signUp)


module.exports = router;