const router = require('express').Router();

const {checkoutSale,countSales} = require('../controllers/salesController');
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

router.post('/pos/sale', authentication,checkoutSaleValidator, checkoutSale);


/**
 * @swagger
 * /api/v1/sales:
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

router.get('/sales', authentication, countSales)

module.exports = router;
