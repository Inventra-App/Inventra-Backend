const router = require('express').Router();
const { authentication } = require('../middlewares/auth');
const { getActivityDescriptions, getActivityLog } = require('../controllers/activityLogContoller');

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

module.exports = router;
