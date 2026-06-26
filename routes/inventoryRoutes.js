const router = require('express').Router()
const { addProducts, moveProducts, getAllItems, restockItem, getOneItem } = require('../controllers/inventoryController');
const { authentication } = require('../middlewares/auth');
const { addProductValidator, moveProductsValidator, recordStockEntryValidator } = require('../middlewares/validator');




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
 *           description: Virtual total stock calculated as availableStock + backroomStock
 *           example: 240
 *         availableStock:
 *           type: number
 *           description: Stock currently available
 *           example: 240
 *         backroomStock:
 *           type: number
 *           description: Stock allocated to backroom storage
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
 *     summary: Add a new product with inventory and batch
 *     tags: [Inventory]
 *     description: >
 *       Admin or Manager only. Creates a product, inventory record, and initial batch.
 *       SKU and batch code are auto-generated.
 *       totalStock is a virtual field computed as availableStock + backroomStock.
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
 *               - availableStock
 *               - backroomStock
 *             properties:
 *               productName:
 *                 type: string
 *                 example: Coca Cola
 *
 *               categoryId:
 *                 type: string
 *                 example: 64abc123def456ghi789
 *
 *               packageType:
 *                 type: string
 *                 example: Carton
 *
 *               packageQuantity:
 *                 type: number
 *                 example: 10
 *
 *               unitPerPackage:
 *                 type: number
 *                 example: 24
 *
 *               unitPrice:
 *                 type: number
 *                 example: 300
 *
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2027-01-01
 *
 *               availableStock:
 *                 type: number
 *                 example: 240
 *
 *               backroomStock:
 *                 type: number
 *                 example: 0
 *
 *     responses:
 *       201:
 *         description: Product, inventory and batch created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     productDetails:
 *                       type: object
 *                       properties:
 *                         productName:
 *                           type: string
 *                         SKU:
 *                           type: string
 *                         categoryName:
 *                           type: string
 *                         batchCode:
 *                           type: string
 *                         packageType:
 *                           type: string
 *                         packageQuantity:
 *                           type: number
 *                         unitPerPackage:
 *                           type: number
 *                         unitPrice:
 *                           type: number
 *
 *                     inventory:
 *                       type: object
 *                       properties:
 *                         availableStock:
 *                           type: number
 *                         backroomStock:
 *                           type: number
 *                         totalStock:
 *                           type: number
 *                           description: Virtual field (availableStock + backroomStock)
 *
 *                     batch:
 *                       type: object
 *                       properties:
 *                         batchCode:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         quantityRemaining:
 *                           type: number
 *                         unitCost:
 *                           type: number
 *                         expiryDate:
 *                           type: string
 *
 *       400:
 *         description: Product already exists
 *
 *       403:
 *         description: Unauthorized role (admin or manager only)
 *
 *       404:
 *         description: Category not found
 *
 *       500:
 *         description: Internal server error
 */

router.post('/product', authentication, addProducts);

/**
 * @swagger
 * /api/v1/p/move/{inventoryId}:
 *   put:
 *     summary: Move stock between available and backroom inventory
 *     tags: [Inventory]
 *     description: >
 *       Admin or Manager only. Moves stock between availableStock and backroomStock.
 *       Ensures stock integrity and prevents overdrawing from either location.
 *       totalStock is virtual and not modified (availableStock + backroomStock).
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory record ID
 *         example: 64abc123def456ghi789
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moveFrom
 *               - moveTo
 *               - quantity
 *             properties:
 *               moveFrom:
 *                 type: string
 *                 description: Source stock location
 *                 enum: [available stock, backroom stock]
 *                 example: available stock
 *
 *               moveTo:
 *                 type: string
 *                 description: Destination stock location
 *                 enum: [available stock, backroom stock]
 *                 example: backroom stock
 *
 *               quantity:
 *                 type: number
 *                 description: Quantity of stock to move
 *                 example: 50
 *
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
 *                   example: Items moved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     availableStock:
 *                       type: number
 *                       example: 190
 *
 *                     backroomStock:
 *                       type: number
 *                       example: 50
 *
 *                     totalStock:
 *                       type: number
 *                       description: Virtual field (availableStock + backroomStock)
 *                       example: 240
 *
 *       400:
 *         description: Invalid request or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not enough products
 *
 *       403:
 *         description: Forbidden - only admin or manager allowed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You are not authorised to perform this action
 *
 *       404:
 *         description: Inventory not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product does not exist or has been changed
 *
 *       401:
 *         description: Unauthorized - invalid or missing token
 *
 *       500:
 *         description: Internal server error
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
 *       like total stock, available stock, backroom stock, and product information.
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
 *                       backroomStock:
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
 *     summary: Record incoming stock delivery (restock inventory)
 *     tags: [Inventory]
 *     description: >
 *       Admin or Manager only. Records a new stock delivery, creates a batch,
 *       and updates backroom stock. totalStock is a virtual field
 *       (availableStock + backroomStock).
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inventoryId
 *               - supplier
 *               - expiryDate
 *               - packageType
 *               - packageQuantity
 *               - unitPerPackage
 *             properties:
 *               inventoryId:
 *                 type: string
 *                 example: 64abc123def456ghi789
 *
 *               supplier:
 *                 type: string
 *                 example: Emzor Pharmaceuticals
 *
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: 2026-12-31
 *
 *               packageType:
 *                 type: string
 *                 example: Carton
 *
 *               packageQuantity:
 *                 type: number
 *                 example: 10
 *
 *               unitPerPackage:
 *                 type: number
 *                 example: 5
 *
 *     responses:
 *       201:
 *         description: Stock entry recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stock entry recorded successfully
 *
 *                 data:
 *                   type: object
 *                   properties:
 *                     batch:
 *                       type: object
 *
 *                     inventory:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         availableStock:
 *                           type: number
 *                         backroomStock:
 *                           type: number
 *                         totalStock:
 *                           type: number
 *                           description: Virtual field (availableStock + backroomStock)
 *
 *                     summary:
 *                       type: object
 *                       properties:
 *                         message:
 *                           type: string
 *                           example: "Stock Entry: 50 units received from Emzor Pharmaceuticals"
 *
 *                         product:
 *                           type: string
 *
 *                         previousStock:
 *                           type: number
 *
 *                         updatedStock:
 *                           type: number
 *
 *                         availableStock:
 *                           type: number
 *
 *                         backroomStock:
 *                           type: number
 *
 *       400:
 *         description: Invalid stock entry
 *
 *       403:
 *         description: Forbidden - only admin or manager allowed
 *
 *       404:
 *         description: Inventory or product not found
 *
 *       401:
 *         description: Unauthorized - invalid or missing token
 *
 *       500:
 *         description: Internal server error
 */
router.post('/stock/entry', authentication, restockItem)


/**
 * @swagger
 * /api/v1/inventory/{inventoryId}:
 *   get:
 *     summary: Get a single inventory item
 *     description: Retrieve a specific inventory item and check if all its batches are expiring.
 *     tags:
 *       - Inventory
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory item ID
 *         example: 6857ac12d34b5c0012345678
 *
 *     responses:
 *       200:
 *         description: Inventory item details fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventory item details fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     item:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 6857ac12d34b5c0012345678
 *                         productName:
 *                           type: string
 *                           example: Indomie Noodles
 *                         totalStock:
 *                           type: number
 *                           example: 200
 *                         availableStock:
 *                           type: number
 *                           example: 150
 *                         reservedStock:
 *                           type: number
 *                           example: 50
 *                         price:
 *                           type: number
 *                           example: 250
 *                     isExpiring:
 *                       type: boolean
 *                       example: false
 *                       description: Returns true only if all batches for this inventory item are marked as expiring
 *
 *       401:
 *         description: Unauthorized - Authentication required
 *
 *       404:
 *         description: Inventory item not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Inventory item not found
 *
 *       500:
 *         description: Internal server error
 */
router.get('/inventory/:inventoryId', authentication, getOneItem);

module.exports = router;