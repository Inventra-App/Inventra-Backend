const router = require('express').Router();
const { authentication, authorize, adminManager } = require('../middlewares/auth');
const { getActivityDescriptions, getActivityLog, getStockMovementLog } = require('../controllers/activityLogContoller');

/**
 * @swagger
 * tags:
 *   name: ActivityLogs
 *   description: Activity log management for supermarkets
 */

/**
 * @swagger
 * /api/v1/activity-logs/descriptions:
 *   get:
 *     summary: Get activity log descriptions only
 *     tags: [ActivityLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity descriptions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Activity descriptions fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/activity-logs/descriptions', authentication, getActivityDescriptions);

/**
 * @swagger
 * /api/v1/activity-logs:
 *   get:
 *     summary: Get all activity logs for the authenticated supermarket
 *     tags: [ActivityLogs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity logs fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Activity logs fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       supermarket:
 *                         type: string
 *                       user:
 *                         type: string
 *                       title:
 *                         type: string
 *                       module:
 *                         type: string
 *                       description:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       entityId:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.get('/activity-logs', authentication, getActivityLog);

/**
 * @swagger
 * /api/v1/stock/log/{inventoryId}:
 *   get:
 *     summary: Get stock movement history for an inventory item
 *     tags: [ActivityLogs]
 *     description: >
 *       Admin or Manager only. Returns all activity logs linked to the inventory item's productId
 *       where the action is `Updated stock`.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inventoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory record ID
 *         example: 64abc123def456ghi789
 *     responses:
 *       200:
 *         description: Movement History fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Movement History fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 66b123abc456def789012345
 *                       supermarket:
 *                         type: string
 *                         example: 64abc123def456ghi789
 *                       user:
 *                         type: string
 *                         example: 64abc123def456ghi790
 *                       role:
 *                         type: string
 *                         example: manager
 *                       action:
 *                         type: string
 *                         example: Updated stock
 *                       module:
 *                         type: string
 *                         example: INVENTORY
 *                       entity:
 *                         type: string
 *                         example: Product
 *                       entityId:
 *                         type: string
 *                         example: 64abc123def456ghi791
 *                       description:
 *                         type: string
 *                         example: Increased stock for a product
 *                       details:
 *                         type: object
 *                         nullable: true
 *                         description: Additional stock change details
 *                       triggeredAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-06-24T10:15:30.000Z
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-06-24T10:15:30.000Z
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: 2026-06-24T10:15:30.000Z
 *       401:
 *         description: Unauthorized - invalid or missing token
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
 *       500:
 *         description: Internal server error
 */
router.get('/stock/log/:inventoryId', authentication, adminManager, getStockMovementLog)

module.exports = router;
