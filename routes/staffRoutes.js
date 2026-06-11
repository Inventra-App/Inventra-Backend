const router = require('express').Router();

const { createStaff,loginStaff } = require('../controllers/staffController');
const { createStaffValidator, loginStaffValidator } = require('../middlewares/validator');
const { authenticate } = require('../middlewares/auth');


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
 *           description: The ID of the admin who created the staff (auto-pulled from authenticated user)
 *           example: 64abc123def456ghi789
 *         firstName:
 *           type: string
 *           description: The staff member's first name
 *           example: John
 *         lastName:
 *           type: string
 *           description: The staff member's last name
 *           example: Doe
 *         userName:
 *           type: string
 *           description: Auto-generated from firstName + random number
 *           example: john4523
 *         role:
 *           type: string
 *           description: The staff member's role
 *           enum: [sales, manager]
 *           example: sales
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
 * /api/v1/create-staff/{adminId}:
 *   post:
 *     summary: Create a new staff member
 *     tags: [Staff]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin creating the staff
 *         example: 64abc123def456ghi789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - password
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 example: Secret123
 *               role:
 *                 type: string
 *                 enum: [sales, manager]
 *                 example: sales
 *     responses:
 *       201:
 *         description: Staff created successfully
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
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/create-staff', authenticate, createStaffValidator,  createStaff);



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


module.exports = router;