const router = require('express').Router();

const { createStaff } = require('../controllers/staffController');
const authentication = require('../middlewares/auth');
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
router.post('/create-staff/:adminId', authentication, createStaff);


module.exports = router;