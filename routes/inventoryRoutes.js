const router = require('express').Router()

const { addProducts, moveProducts } = require('../controllers/inventoryController');
const { authentication } = require('../middlewares/auth');




/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Inventory management for supermarkets
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Inventory:
 *       type: object
 *       properties:
 *         supermarketId:
 *           type: string
 *           description: The ID of the supermarket (auto-pulled from authenticated user)
 *           example: 64abc123def456ghi789
 *         productId:
 *           type: string
 *           description: The ID of the product (auto-generated)
 *           example: 64abc123def456ghi790
 *         categoryName:
 *           type: string
 *           description: The name of the category (auto-pulled from category)
 *           example: Beverages
 *         totalStock:
 *           type: number
 *           description: Total stock calculated from unitPerPackage x packageQuantity
 *           example: 240
 *         availableStock:
 *           type: number
 *           description: Stock currently available
 *           example: 240
 *         reservedStock:
 *           type: number
 *           description: Stock currently reserved
 *           example: 0
 *         updatedBy:
 *           type: string
 *           description: ID of the staff who last updated the inventory
 *           example: 64abc123def456ghi792
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Dashboard:
 *       type: object
 *       properties:
 *         totalStockUnits:
 *           type: number
 *           description: Total stock units across all inventory items
 *           example: 5000
 *         totalProducts:
 *           type: number
 *           description: Total count of all products in the system
 *           example: 120
 */



/**
 * @swagger
 * /api/v1/inventory/product:
 *   post:
 *     summary: Add a new product to inventory
 *     tags: [Inventory]
 *     description: >
 *       Admin or Manager only. Creates a new product, inventory record, and batch
 *       all in one request. Auto-generates SKU and batch code.
 *       Total stock is calculated as unitPerPackage x packageQuantity.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - categoryId
 *               - packageType
 *               - packageQuantity
 *               - unitPerPackage
 *               - unitPrice
 *               - expiryDate
 *             properties:
 *               productName:
 *                 type: string
 *                 description: Name of the product
 *                 example: Coca Cola
 *               categoryId:
 *                 type: string
 *                 description: ID of the category this product belongs to
 *                 example: 64abc123def456ghi789
 *               packageType:
 *                 type: string
 *                 description: Type of packaging
 *                 example: Carton
 *               packageQuantity:
 *                 type: number
 *                 description: Number of packages being added
 *                 example: 10
 *               unitPerPackage:
 *                 type: number
 *                 description: Number of units in each package
 *                 example: 24
 *               unitPrice:
 *                 type: number
 *                 description: Price per unit
 *                 example: 300
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 description: Expiry date of this batch
 *                 example: 2027-01-01
 *     responses:
 *       201:
 *         description: Product added successfully with inventory and batch records created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added sucessfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     productDetails:
 *                       type: object
 *                       description: The newly created product
 *                       properties:
 *                         productName:
 *                           type: string
 *                           example: Coca Cola
 *                         SKU:
 *                           type: string
 *                           example: SKU-CC-001
 *                         categoryName:
 *                           type: string
 *                           example: Beverages
 *                         packageType:
 *                           type: string
 *                           example: Carton
 *                         packageQuantity:
 *                           type: number
 *                           example: 10
 *                         unitPerPackage:
 *                           type: number
 *                           example: 24
 *                         unitPrice:
 *                           type: number
 *                           example: 300
 *                         status:
 *                           type: string
 *                           example: active
 *                     inventory:
 *                       type: object
 *                       description: The newly created inventory record
 *                       properties:
 *                         totalStock:
 *                           type: number
 *                           example: 240
 *                         availableStock:
 *                           type: number
 *                           example: 240
 *                         reservedStock:
 *                           type: number
 *                           example: 0
 *                     batch:
 *                       type: object
 *                       description: The newly created batch record
 *                       properties:
 *                         batchCode:
 *                           type: string
 *                           example: BATCH-2026-001
 *                         quantity:
 *                           type: number
 *                           example: 240
 *                         quantityRemaining:
 *                           type: number
 *                           example: 240
 *                         unitCost:
 *                           type: number
 *                           example: 300
 *                         expiryDate:
 *                           type: string
 *                           example: 2027-01-01
 *                         status:
 *                           type: string
 *                           example: active
 *       400:
 *         description: Product already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product details already exist. Please move to ... to update the product
 *       403:
 *         description: Forbidden - only admin or manager can perform this action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are not authorised to perform this action!
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

router.post('/product', authentication , addProducts);

router.put('/p/move/:inventoryId', authentication, moveProducts);

module.exports = router