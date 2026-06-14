const router = require('express').Router()
const { getExpiringProducts } = require('../controllers/expiryController');
const { authentication } = require('../middlewares/auth');



/**
 * @swagger
 * tags:
 *   name: Alerts
 *   description: Product expiry management and alerts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ExpiringProduct:
 *       type: object
 *       properties:
 *         product:
 *           type: string
 *           description: Name of the expiring product
 *           example: Coca Cola
 *         batchNumber:
 *           type: string
 *           description: Batch number of the expiring product
 *           example: BATCH-0001
 *         expiresIn:
 *           type: string
 *           description: Number of days left before expiry
 *           example: 10 days
 *         urgency:
 *           type: string
 *           description: Urgency level based on days left
 *           enum: [CRITICAL, URGENT, WARNING, NOTICE]
 *           example: URGENT
 */

/**
 * @swagger
 * /api/v1/expiry/check:
 *   get:
 *     tags: [Alerts-expiry]
 *     summary: Check expiring products
 *     description: >
 *       Checks all batches expiring within the next 2 months and sends
 *       email alerts to the admin. Urgency levels are assigned as follows:
 *       CRITICAL (≤7 days), URGENT (≤14 days), WARNING (≤30 days), NOTICE (≤60 days).
 *     responses:
 *       200:
 *         description: Expiring products checked and alerts sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Expiring products checked successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ExpiringProduct'
 *       404:
 *         description: No products nearing expiry
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No products nearing expiry
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

router.get('/expiry/check',authentication, getExpiringProducts);

// router.get('/expiry/check', (req, res) => {
//     res.json({
//         message: 'Expiry route works'
//     });
// });

    
module.exports = router;