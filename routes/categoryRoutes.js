const router = require('express').Router();

const { createCategory, getCategories } = require('../controllers/categoryConroller');
const {authenticate} = require('../middlewares/auth')








/**
 * @swagger
 * tags:
 *   name: Category
 *   description: Category management for supermarkets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         supermarketId:
 *           type: string
 *           description: The ID of the supermarket (auto-pulled from authenticated user)
 *           example: 64abc123def456ghi789
 *         categoryName:
 *           type: string
 *           description: The name of the category
 *           example: Beverages
 *         description:
 *           type: string
 *           description: A brief description of the category
 *           example: All kinds of drinks and beverages
 */

/**
 * @swagger
 * /api/v1/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryName
 *               - description
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: The name of the category
 *                 example: Beverages
 *               description:
 *                 type: string
 *                 description: A brief description of the category
 *                 example: All kinds of drinks and beverages
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category added sucessfuly
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post('/category', authenticate, createCategory);

router.get('/f/category', authenticate, getCategories);

module.exports = router;