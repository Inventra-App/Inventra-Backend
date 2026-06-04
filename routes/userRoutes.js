const router = require('express').Router()

const { signUp, verifyUser,login, forgotPassword,resetPassword} = require('../controllers/userController');
const { signUpValidator, verifyUserValidator, loginValidator, forgotPasswordValidator,resetPasswordValidator } = require('../middlewares/validator');

router.post('/user', signUpValidator, signUp)
router.post('/verify', verifyUserValidator, verifyUser)
router.post('/login', loginValidator, login)
router.post('/forgot', forgotPasswordValidator, forgotPassword,)
router.post('/reset', resetPasswordValidator, resetPassword)




module.exports = router;