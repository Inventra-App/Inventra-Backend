const router = require('express').Router();

const { getTotalStockUnits, getTotalProducts } = require('../controllers/dashboardController')





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
 *     tags: [Dashboard]
 *     summary: Get total stock units
 *     description: Retrieves and calculates the total stock units across all inventory items.
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
 *                   example: Total Units Fetched Successfully
 *                 data:
 *                   type: number
 *                   description: Total stock units across all inventory
 *                   example: 5000
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
router.get('/dashboard/tsu', getTotalStockUnits)




/**
 * @swagger
 * /api/v1/dasboard/gtp:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get total number of products
 *     description: Returns the total count of all products in the system.
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
 *                   example: Products Fetced Successfully
 *                 data:
 *                   type: number
 *                   description: Total count of all products
 *                   example: 120
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
router.get('/dasboard/gtp', getTotalProducts)

module.exports = router