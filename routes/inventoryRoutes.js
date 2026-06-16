const router = require('express').Router()

const { addProducts, moveProducts, getAllItems, recordStockEntry } = require('../controllers/inventoryController');
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
 * /api/v1/product:
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

/**
 * @swagger
 * /api/v1/p/move/{inventoryId}:
 *   put:
 *     summary: Move stock between inventory states
 *     tags: [Inventory]
 *     description: >
 *       Admin or Manager only. Moves stock between available and reserved stock,
 *       or allocates stock from total stock into available stock.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: The inventory record ID
 *         example: 64abc123def456ghi789
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - actionType
 *               - moveFrom
 *               - moveTo
 *               - quantity
 *             properties:
 *               actionType:
 *                 type: string
 *                 description: Type of stock movement
 *                 example: transfer
 *               moveFrom:
 *                 type: string
 *                 description: Source stock location
 *                 example: available stock
 *               moveTo:
 *                 type: string
 *                 description: Destination stock location
 *                 example: reserved stock
 *               quantity:
 *                 type: number
 *                 description: Quantity of stock to move
 *                 example: 50
 *     responses:
 *       200:
 *         description: Stock moved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock moved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalStock:
 *                       type: number
 *                       example: 240
 *                     availableStock:
 *                       type: number
 *                       example: 190
 *                     reservedStock:
 *                       type: number
 *                       example: 50
 *       400:
 *         description: Invalid request or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Insufficient stock to move
 *       403:
 *         description: Forbidden - only admin or manager can perform this action
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are not authorised to perform this action
 *       404:
 *         description: Inventory record not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product does not exist or has been changed
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

router.put('/p/move/:inventoryId', authentication, moveProducts);

/**
 * @swagger
 * /api/v1/i/all:
 *   get:
 *     summary: Get all inventory records
 *     tags: [Inventory]
 *     description: >
 *       Fetches all inventory records in the supermarket, including stock details
 *       like total stock, available stock, reserved stock, and product information.
 *       Accessible to authenticated users.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventory fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64abc123def456ghi789
 *                       productId:
 *                         type: string
 *                         example: 64abc123def456ghi790
 *                       totalStock:
 *                         type: number
 *                         example: 240
 *                       availableStock:
 *                         type: number
 *                         example: 200
 *                       reservedStock:
 *                         type: number
 *                         example: 40
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-06-15T10:00:00.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-06-15T12:00:00.000Z
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
 *       404:
 *         description: No inventory records found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No inventory records found
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

router.get('/i/all', authentication, getAllItems);

/**
 * @swagger
 * /api/v1/stock/entry:
 *   post:
 *     summary: Record incoming stock entry
 *     description: Creates a new batch and updates inventory stock allocation.
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - supplier
 *               - expiryDate
 *               - packageType
 *               - packageQuantity
 *               - unitPerPackage
 *               - availableStock
 *               - reservedStock
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 685f1234567890abc1234567
 *               supplier:
 *                 type: string
 *                 example: Emzor Pharmaceuticals
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *               packageType:
 *                 type: string
 *                 example: Carton
 *               packageQuantity:
 *                 type: number
 *                 example: 10
 *               unitPerPackage:
 *                 type: number
 *                 example: 5
 *               availableStock:
 *                 type: number
 *                 example: 30
 *               reservedStock:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Stock recorded successfully
 *       400:
 *         description: Invalid stock allocation
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/stock/entry', authentication, recordStockEntry)

module.exports = router;