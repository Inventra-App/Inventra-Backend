const router = require('express').Router();
const { createCategoryValidator } = require('../middlewares/validator');
const { createCategory, getCategories, getOneCategory, updateCategory, deleteCategory } = require('../controllers/categoryConroller');
const { authentication, authorize, adminManager } = require('../middlewares/auth')


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
router.post('/category', authentication, adminManager, createCategory);


/**
 * @swagger
 * /api/v1/allCategories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Categories retrieved successfully
 *                 count:
 *                   type: number
 *                   description: Total number of categories
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       404:
 *         description: No categories found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No categories found
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

router.get('/allCategories', authentication, getCategories);


/**
 * @swagger
 * /api/v1/category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID
 *         example: 64abc123def456ghi789
 *     responses:
 *       200:
 *         description: Category found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category found successfully
 *                 data:
 *                   $ref: '#/components/schemas/Category'
 *       400:
 *         description: Invalid category ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid category ID format.
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found!
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

router.get('/category/:id', authentication, getOneCategory);

/**
 * @swagger 
 * /api/v1/d/category/{categoryId}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The category ID to delete
 *         example: 64abc123def456ghi789
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category deleted successfully
 *       400:
 *         description: Invalid category ID format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid category ID format.
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category not found!
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

router.delete('/d/category/:categoryId', authentication, adminManager, deleteCategory);

/**
 * @swagger
 * /api/v1/category/{id}:
 *   patch:
 *     summary: Update a category
 *     description: Update a category's name or description for the authenticated supermarket.
 *     tags:
 *       - Category
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *         example: 685f1234567890abc1234567
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *                 example: Soft Drinks
 *               description:
 *                 type: string
 *                 example: All carbonated and non-carbonated drinks
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Category updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 685f1234567890abc1234567
 *                     categoryName:
 *                       type: string
 *                       example: Soft Drinks
 *                     description:
 *                       type: string
 *                       example: All carbonated and non-carbonated drinks
 *       400:
 *         description: Category name already exists
 *       404:
 *         description: Category not found
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.patch('/category/:id', authentication, adminManager, updateCategory);

module.exports = router;