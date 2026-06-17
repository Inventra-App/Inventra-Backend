const router = require('express').Router();

const { createStaff,loginStaff, createPassword } = require('../controllers/staffController');
const { createStaffValidator, loginStaffValidator } = require('../middlewares/validator');
const { authentication, staffInvite } = require('../middlewares/auth');

/**
 * @swagger
 * tags:
 *   name: Staff
 *   description: Staff management for supermarkets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Staff:
 *       type: object
 *       properties:
 *         adminId:
 *           type: string
 *           description: The ID of the admin who created the staff
 *           example: 64abc123def456ghi789
 *         firstName:
 *           type: string
 *           description: The staff member's first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: The staff member's last name
 *           example: Doe
 *         username:
 *           type: string
 *           description: Auto-generated from firstName + random number
 *           example: john4523
 *         email:
 *           type: string
 *           description: The staff member's email address
 *           example: john@example.com
 *         role:
 *           type: string
 *           description: The staff member's role
 *           enum: [sales, manager]
 *           example: sales
 *         isActive:
 *           type: boolean
 *           description: Whether the staff account is activated
 *           default: false
 *           example: false
 *         isVerified:
 *           type: boolean
 *           description: Whether the staff account is verified
 *           default: false
 *           example: false
 *         token:
 *           type: string
 *           description: Invite token sent to staff email
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/v1/create-staff:
 *   post:
 *     tags: [Staff]
 *     summary: Create and invite a new staff member
 *     description: >
 *       Creates a new staff member and sends an invite email with a
 *       password setup link to the staff email. The link expires in 1 day.
 *       The username is auto-generated from firstName + random number.
 *       The staff account remains inactive until the password is created.
 *     security:
 *       - bearerAuth: []
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
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               role:
 *                 type: string
 *                 enum: [sales, manager]
 *                 example: sales
 *     responses:
 *       201:
 *         description: Staff created and invite email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Staff created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Staff'
 *       404:
 *         description: Admin not found - not authorised to perform this action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are not authourised to perform this action. Please contact your administrator
 *       401:
 *         description: Unauthorized - invalid or missing token
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
router.post('/create-staff', authentication, createStaffValidator, createStaff);


/**
 * @swagger
 * /api/v1/staff/login:
 *   post:
 *     tags: [Staff]
 *     summary: Login as a staff member
 *     description: Authenticates a staff member with username and password. Returns a JWT token valid for 1 day.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The staff member's auto-generated username
 *                 example: john4523
 *               password:
 *                 type: string
 *                 description: The staff member's password
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
 *                   example: Login sucesssful. You may pass!
 *                 data:
 *                   $ref: '#/components/schemas/Staff'
 *                 token:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials. Please contact your administrator
 *       404:
 *         description: Staff member not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid credentials. Please contact your administrator.
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
 *             example: Something went wrong
 */

router.post('/staff/login', loginStaffValidator, loginStaff);
    
module.exports = router