const router = require('express').Router()

const {getAllBatches, getOneBatch, checkExpiringProducts}= require('../controllers/batchController')
const {authentication} = require('../middlewares/auth')



/**
 * @swagger
 * tags:
 *   name: Batch
 *   description: Batch management for inventory
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Batch:
 *       type: object
 *       properties:
 *         supermarketId:
 *           type: string
 *           description: The ID of the supermarket
 *           example: 64abc123def456ghi789
 *         inventoryId:
 *           type: string
 *           description: The ID of the inventory
 *           example: 64abc123def456ghi790
 *         productId:
 *           type: string
 *           description: The ID of the product
 *           example: 64abc123def456ghi791
 *         batchCode:
 *           type: string
 *           description: Unique code for the batch
 *           example: BATCH-2026-001
 *         quantity:
 *           type: number
 *           description: Total quantity in the batch
 *           example: 100
 *         quantityRemaining:
 *           type: number
 *           description: Quantity remaining in the batch
 *           example: 75
 *         unitCost:
 *           type: number
 *           description: Cost per unit
 *           example: 500
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: Expiry date of the batch
 *           example: 2027-01-01
 *         status:
 *           type: string
 *           enum: [active, expired, depleted]
 *           description: Current status of the batch
 *           example: active
 *         createdBy:
 *           type: string
 *           description: ID of the staff who created the batch
 *           example: 64abc123def456ghi792
 */


/**
 * @swagger
 * /api/v1/batch/getAll:
 *   get:
 *     summary: Get all batches
 *     tags: [Batch]
 *     description: Returns all batches in the system. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All batches retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Batches found successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Batch'
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

router.get('/getAll',authentication ,getAllBatches)

/**
 * @swagger
 * /api/v1/batch/getOne/{id}:
 *   get:
 *     summary: Get one batch by ID
 *     tags: [Batch]
 *     description: Returns a single batch by its ID. Requires authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the batch to retrieve
 *         schema:
 *           type: string
 *           example: 64abc123def456ghi789
 *     responses:
 *       200:
 *         description: Batch found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Batch found successfully
 *                 data:
 *                   $ref: '#/components/schemas/Batch'
 *       404:
 *         description: Batch not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Batch not found!
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

router.get('/getOne/:id',authentication ,getOneBatch)

module.exports = router;