const router = require('express').Router()
const { Router } = require('express')
const {getAllProducts, getOneProduct} = require('../controllers/productController')
const {authenticate} = require('../middlewares/auth')




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

router.get('/getAll', authenticate,getAllProducts)

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




router.get('/getOne/:id',authenticate,getOneProduct)


module.exports = router