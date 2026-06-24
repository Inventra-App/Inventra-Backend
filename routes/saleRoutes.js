const router = require('express').Router();

const {
    checkoutSale,
    countSales,
    countSalesAmount,
    getAllSales,
    getDailySalesTotal
} = require('../controllers/salesController');
const { authentication } = require('../middlewares/auth');
const { checkoutSaleValidator } = require('../middlewares/validator');

/**
 * @swagger
 * /api/v1/pos/sale:
 *   post:
 *     summary: Checkout and create a sale
 *     tags: [Sales]
 *     description: >
 *       Processes a POS sale by validating products, reducing available stock,
 *       calculating totals, and creating both Sale and SaleItem records.
 *       Accessible by authorised staff only.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - paymentMethod
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 example: cash
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 6a2889df5e2db88a74d9a38f
 *                     quantity:
 *                       type: number
 *                       example: 2
 *     responses:
 *       201:
 *         description: Sale successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sale successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     sale:
 *                       type: object
 *                       properties:
 *                         saleNumber:
 *                           type: string
 *                           example: SALE-001
 *                         paymentMethod:
 *                           type: string
 *                           example: cash
 *                         totalAmount:
 *                           type: number
 *                           example: 55000
 *                         totalItems:
 *                           type: number
 *                           example: 11
 *                         status:
 *                           type: string
 *                           example: completed
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           productName:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                           unitPrice:
 *                             type: number
 *                           subtotal:
 *                             type: number
 *       400:
 *         description: Product out of stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Coca Cola out of stock
 *       403:
 *         description: Forbidden - unauthorised action
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product not found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */

router.post('/pos/sale', authentication, checkoutSale);


/**
 * @swagger
 * /api/v1/sales/count:
 *   get:
 *     summary: Count total sales
 *     tags: [Sales]
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
 *                   example: 24
 *       404:
 *         description: No sales found yet
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

router.get('/sales/count', authentication, countSales)

router.get('/sales/daily-total', authentication, getDailySalesTotal);

/**
 * @swagger
 * /api/v1/sales:
 *   get:
 *     summary: Get all sales
 *     description: Returns a paginated list of all sales made in the supermarket.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Current page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of sales per page
 *     responses:
 *       200:
 *         description: Sales fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sales fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 685f1234567890abc1234567
 *                       cashierId:
 *                         type: string
 *                         example: 685f1234567890abc1234568
 *                       paymentMethod:
 *                         type: string
 *                         example: cash
 *                       totalAmount:
 *                         type: number
 *                         example: 15000
 *                       totalItems:
 *                         type: number
 *                         example: 5
 *                       saleNumber:
 *                         type: string
 *                         example: 0001
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-06-18T14:00:00.000Z
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: number
 *                       example: 1
 *                     perPage:
 *                       type: number
 *                       example: 5
 *                     totalSales:
 *                       type: number
 *                       example: 57
 *                     totalPages:
 *                       type: number
 *                       example: 12
 *                     hasNextPage:
 *                       type: boolean
 *                       example: true
 *                     hasPreviousPage:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: No sales found
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/sales', authentication, getAllSales);


/**
 * @swagger
 * /api/v1/sale/amount:
 *   get:
 *     summary: Get total sales amount
 *     description: Returns the total amount of all sales made in the supermarket.
 *     tags:
 *       - Sales
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Total sales amount retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Here's how much you've sold!
 *                 data:
 *                   type: number
 *                   example: 250000
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get('/sale/amount', authentication, countSalesAmount);

module.exports = router;
