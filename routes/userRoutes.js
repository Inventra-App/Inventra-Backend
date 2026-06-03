const router = require('express').Router()

const { signUp, verifyUser,login} = require('../controllers/userController');
const { signUpValidator, verifyUserValidator, loginValidator } = require('../middlewares/validator');

router.post('/user', signUpValidator, signUp)
router.post('/verify', verifyUserValidator, verifyUser)
router.post('/login', loginValidator, login)




module.exports = router;