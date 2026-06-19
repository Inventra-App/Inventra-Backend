const router = require('express').Router()
const { Router } = require('express')
const {getAllProducts, getOneProduct, getProductsByCategory} = require('../controllers/productController')
const {authentication} = require('../middlewares/auth')




/**
 * @swagger
 * tags:
 *   name: Product
 *   description: Product management for supermarkets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         supermarketId:
 *           type: string
 *           description: The ID of the supermarket
 *           example: 64abc123def456ghi789
 *         categoryId:
 *           type: string
 *           description: The ID of the category
 *           example: 64abc123def456ghi790
 *         categoryName:
 *           type: string
 *           description: The name of the category
 *           example: Beverages
 *         productName:
 *           type: string
 *           description: The name of the product
 *           example: Coca Cola
 *         SKU:
 *           type: string
 *           description: Unique stock keeping unit code
 *           example: SKU-CC-001
 *         packageType:
 *           type: string
 *           description: Type of packaging
 *           example: Carton
 *         packageQuantity:
 *           type: number
 *           description: Number of packages in stock
 *           example: 50
 *         unitPerPackage:
 *           type: number
 *           description: Number of units in each package
 *           example: 24
 *         reorderLevel:
 *           type: number
 *           description: Minimum stock level before reorder is triggered
 *           example: 10
 *         unitPrice:
 *           type: number
 *           description: Price per unit
 *           example: 300
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: Current status of the product
 *           example: active
 *         createdBy:
 *           type: string
 *           description: ID of the staff who created the product
 *           example: 64abc123def456ghi792
 */

/**
 * @swagger
 * /api/v1/product/getAll:
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     description: Returns all products in the system. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Products found successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Please login again.
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

router.get('/getAll', authentication ,getAllProducts)

/**
 * @swagger
 * /api/v1/product/getOne/{id}:
 *   get:
 *     summary: Get one product by ID
 *     tags: [Product]
 *     description: Returns a single product by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the product to retrieve
 *         schema:
 *           type: string
 *           example: 64abc123def456ghi789
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product found successfully
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found!
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access denied. Please login again.
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

router.get('/getOne/:id', authentication ,getOneProduct);

/**
 * @swagger
 * /api/v1/products/category/{categoryId}:
 *   get:
 *     summary: Get all products by category
 *     description: Returns all products under a specific category for the authenticated supermarket.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the category
 *         example: 685f1234567890abc1234567
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Products fetched successfully
 *                 total:
 *                   type: number
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 685f1234567890abc1234568
 *                       productName:
 *                         type: string
 *                         example: Maltina Can
 *                       categoryId:
 *                         type: string
 *                         example: 685f1234567890abc1234567
 *                       packageType:
 *                         type: string
 *                         example: carton
 *                       packageQuantity:
 *                         type: number
 *                         example: 24
 *                       unitPerPackage:
 *                         type: number
 *                         example: 6
 *                       unitPrice:
 *                         type: number
 *                         example: 350
 *                       supplier:
 *                         type: string
 *                         example: Nigerian Breweries
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No products found for this category
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/products/category/:categoryId', authentication, getProductsByCategory);


module.exports = router