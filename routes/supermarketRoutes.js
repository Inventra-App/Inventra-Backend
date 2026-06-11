const router = require('express').Router();
// const rateLimiter = require('../middleware/rateLimiter');
const { signUp, verifyUser, resendOTP, login, forgotPassword, resetPassword, loginWithGoogle, addBusinessName } = require('../controllers/supermarketController');
const { signUpValidator, verifyUserValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, resendOtpValidator } = require('../middlewares/validator');
const { profile, loginProfile } = require('../middlewares/passport')
const { authenticate } = require('../middlewares/auth')


/**
 * @swagger
 * tags:
 *   name: supermarket
 *   description: User authentication and account management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *      Supermarket:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The user's first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: The user's last name
 *           example: Doe
 *         email:
 *           type: string
 *           description: The user's email address
 *           example: john@example.com
 *         businessName:
 *           type: string
 *           description: The user's business name
 *           example: Acme Ltd
 *         phoneNumber:
 *           type: string
 *           description: The user's phone number
 *           example: +2348012345678
 *         password:
 *           type: string
 *           description: The user's password
 *           example: Secret123
 */

/**
 * @swagger
 * /api/v1/user:
 *   post:
 *     tags: [supermarket]
 *     summary: Register a new user
 *     description: Creates a new user account, hashes the password with bcrypt, generates a 6-digit OTP and sends it to the provided email. OTP expires in 10 minutes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - businessName
 *               - phoneNumber
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: The user's first name
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: The user's last name
 *                 example: Smith
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: onyebenneth30@gmail.com
 *               businessName:
 *                 type: string
 *                 description: The user's business name
 *                 example: smartMart
 *               phoneNumber:
 *                 type: string
 *                 description: The user's phone number
 *                 example: +2349095646367
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: Smart123
 *               confirmPassword:
 *                 type: string
 *                 description: Must match password
 *                 example: Smart123
 *     responses:
 *       201:
 *         description: User registered successfully. OTP sent to email.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Welcome to Inventra! Please check your email for the OTP to complete your registration.
 *                 data:
 *                   type: object
 *                   description: The newly created user object
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: An error message
 *                   example: User already exists. Please proceed to login
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.post('/user', signUpValidator, signUp);

/**
 * @swagger
 * /api/v1/verify:
 *   post:
 *     tags: [supermarket]
 *     summary: Verify email with OTP
 *     description: Validates the 6-digit OTP sent to the user's email after sign up. Marks the account as verified and clears the OTP. OTP expires after 10 minutes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: onyebenneth20@gmail.com
 *               otp:
 *                 type: string
 *                 description: The 6-digit OTP received via email
 *                 example: "482910"
 *     responses:
 *       200:
 *         description: User verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: User verified successfully
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid OTP
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post('/verify', verifyUserValidator, verifyUser);


/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     tags: [supermarket]
 *     summary: Login
 *     description: Autghenticates the user with email and password. Returns a JWT token valid for 1 day. After 3 failed attempts the account is locked for 2 minutes. Login attempts and lock are reset on success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's registered email address
 *                 example: onyebenneth20@gmail.com
 *               password:
 *                 type: string
 *                 description: The user's password                             
 *                 example: Secret123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Login Successful
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials
 *       403:
 *         description: Account locked or email not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account is locked until 2024-01-01T12:02:00.000Z"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.post('/login', loginValidator, login);


/**
 * @swagger
 * /api/v1/resend-otp:
 *   post:
 *     tags: [supermarket]
 *     summary: Resend OTP
 *     description: Generates a fresh 6-digit OTP and sends it to the user's registered email. The previous OTP is overwritten. New OTP expires in 10 minutes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's registered email address
 *                 example: onyebenneth20@gmail.com
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: OTP resent successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 */
router.post('/resend-otp',resendOtpValidator, resendOTP);

/**
 * @swagger
 * /api/v1/forgot:
 *   post:
 *     tags: [supermarket]
 *     summary: Forgot password
 *     description: Sends a 6-digit OTP to the user's registered email to initiate a password reset. OTP expires after 5 minutes.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's registered email address
 *                 example: onyebenneth20@gmail.com
 *     responses:
 *       200:
 *         description: Password reset OTP sent to email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Please check your email for your password reset OTP
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.post('/forgot', forgotPasswordValidator, forgotPassword);

/**
 * @swagger
 * /api/v1/reset:
 *   post:
 *     tags: [supermarket]
 *     summary: Reset password
 *     description: Resets the user's password after verifying the OTP from the forgot-password step. The OTP is cleared after a successful reset and a confirmation email is sent.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's registered email address
 *                 example: onyebenneth20@gmail.com
 *               otp:
 *                 type: string
 *                 description: The 6-digit OTP received via email
 *                 example: "391047"
 *               password:
 *                 type: string
 *                 description: The new password to set
 *                 example: NewSecret123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Password reset successfully
 *       400:
 *         description: Invalid or expired OTP, or missing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid or expired OTP
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */

router.post('/reset', resetPasswordValidator, resetPassword);


/**
 * @swagger
 * /api/v1/business-name:
 *   patch:
 *     tags: [supermarket]
 *     summary: Update business name
 *     description: Allows an authenticated supermarket owner to update their business name.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *             properties:
 *               businessName:
 *                 type: string
 *                 description: The new business name
 *                 example: SmartMart Ltd
 *     responses:
 *       200:
 *         description: Business name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You ate that!
 *       403:
 *         description: Supermarket not found - not a registered business
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are not a registered business!
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Something went wrong
 */
router.patch('/business-name', authenticate, addBusinessName)

router.get('/auth/google', profile)
router.get('/auth/google/callback', loginProfile, loginWithGoogle)

module.exports = router;




























// const router = require('express').Router()
// const { signUp, verifyUser,login, forgotPassword,resetPassword} = require('../controllers/userController');
// const { signUpValidator, verifyUserValidator, loginValidator, forgotPasswordValidator,resetPasswordValidator } = require('../middlewares/validator');

// router.post('/user', signUpValidator, signUp)
// router.post('/verify', verifyUserValidator, verifyUser)
// router.post('/login', loginValidator, login)
// router.post('/forgot', forgotPasswordValidator, forgotPassword,)
// router.post('/reset', resetPasswordValidator, resetPassword)




// module.exports = router;