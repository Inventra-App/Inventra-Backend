const router = require('express').Router();

const { createSubscriptionPlan } = require('../controllers/subscriptionPlanController');
const authenticate = require('../middlewares/auth');




/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Subscription plan management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionPlan:
 *       type: object
 *       properties:
 *         subscriptionName:
 *           type: string
 *           description: The name of the subscription plan (must match a plan key)
 *           enum: [free, standard, premium]
 *           example: premium
 *         price:
 *           type: number
 *           description: The cost of the subscription plan
 *           example: 9.99
 *         billingCycle:
 *           type: string
 *           description: Billing cycle of the plan
 *           enum: [monthly, yearly]
 *           example: monthly
 *         maxStaff:
 *           type: number
 *           description: Maximum number of staff allowed on the plan
 *           example: 10
 *         features_Json:
 *           type: object
 *           description: Features auto-assigned based on subscriptionName
 *           properties:
 *             inventory_management:
 *               type: boolean
 *               example: true
 *             sales_tracking:
 *               type: boolean
 *               example: true
 *             expiry_alerts:
 *               type: boolean
 *               example: true
 *             reports:
 *               type: boolean
 *               example: true
 *             multi_staff:
 *               type: boolean
 *               example: true
 *             analytics_dashboard:
 *               type: boolean
 *               example: true
 *             export_reports:
 *               type: boolean
 *               example: true
 *             priority_support:
 *               type: boolean
 *               example: true
 *             api_access:
 *               type: boolean
 *               example: true
 *             multi_branch:
 *               type: boolean
 *               example: true
 */

/**
 * @swagger
 * /api/v1/sub-plan:
 *   post:
 *     summary: Create a new subscription plan
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionName
 *               - price
 *               - billingCycle
 *               - maxStaff
 *             properties:
 *               subscriptionName:
 *                 type: string
 *                 description: Must be one of the supported plan names
 *                 enum: [free, standard, premium]
 *                 example: premium
 *               price:
 *                 type: number
 *                 example: 9.99
 *               billingCycle:
 *                 type: string
 *                 enum: [monthly, yearly]
 *                 example: monthly
 *               maxStaff:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Subscription plan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: subscription plan created successfully
 *                 data:
 *                   $ref: '#/components/schemas/SubscriptionPlan'
 *       500:
 *         description: Internal server error
 */

router.post('/sub-plan', createSubscriptionPlan);

module.exports = router;

