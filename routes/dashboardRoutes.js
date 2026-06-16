const router = require('express').Router();

const { getTotalStockUnits, getTotalProducts, countSales } = require('../controllers/dashboardController');
const { authentication } = require('../middlewares/auth');





/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics and statistics
 */

/**
 * @swagger
 * /api/v1/dashboard/tsu:
 *   get:
 *     summary: Get total stock units
 *     tags: [Dashboard]
 *     description: Returns the total stock units currently in inventory.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total stock units fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total stock units
 *                 data:
 *                   type: number
 *                   example: 1200
 *       404:
 *         description: No stock found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No stock available
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */

router.get('/dashboard/tsu', authentication, getTotalStockUnits);

/**
 * @swagger
 * /api/v1/dashboard/gtp:
 *   get:
 *     summary: Get total products
 *     tags: [Dashboard]
 *     description: Returns the total number of products in the system.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total products fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total products
 *                 data:
 *                   type: number
 *                   example: 45
 *       404:
 *         description: No products found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No products found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */

router.get('/dashboard/gtp', authentication, getTotalProducts);

/**
 * @swagger
 * /api/v1/dashboard/tsa:
 *   get:
 *     summary: Get total sales amount
 *     tags: [Dashboard]
 *     description: Returns the total number of sales made.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total sales fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Total sales
 *                 data:
 *                   type: number
 *                   example: 150
 *       404:
 *         description: No sales found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Nothing sold yet. Come back when you make a sale!
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */

router.get('/dashboard/tsa', authentication, countSales);

module.exports = router