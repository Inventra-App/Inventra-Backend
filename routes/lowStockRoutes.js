const router = require('express').Router();
const { getLowStock } = require('../controllers/lowStockController');
const { authentication } = require('../middlewares/auth');
const { get } = require('../test2');





/**
 * @swagger
 * tags:
 *   name: Alerts
 *   description: Low stock and expiry product alerts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LowStockItem:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: Name of the low stock product
 *           example: Coca Cola
 *         totalStock:
 *           type: number
 *           description: Total stock of the product
 *           example: 100
 *         availableStock:
 *           type: number
 *           description: Available stock of the product
 *           example: 5
 *         reservedStock:
 *           type: number
 *           description: Reserved stock of the product
 *           example: 2
 *         stockLevel:
 *           type: string
 *           description: Stock level based on available stock
 *           enum: [LOW, CRITICAL]
 *           example: CRITICAL
 */

/**
 * @swagger
 * /api/v1/low-stock/check:
 *   get:
 *     tags: [Alert-low-stock]
 *     summary: Check low stock products
 *     description: >
 *       Checks all inventory items with available stock at or below 10 units
 *       and sends email alerts to the admin. Stock levels are assigned as follows:
 *       CRITICAL (≤5 units), LOW (≤10 units).
 *       This endpoint is also automatically triggered every day at 9:00 AM
 *       via a cron job (0 9 * * *).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock products checked and alerts sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Low stock products checked successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/LowStockItem'
 *       404:
 *         description: No low stock products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No low stock products found
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

router.get('/low-stock/check',authentication, getLowStock );

router.get('/getBatches/:id', get)
module.exports = router;