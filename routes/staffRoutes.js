const router = require('express').Router();

const { createStaff } = require('../controllers/staffController');
const authentication = require('../middlewares/auth');

/**********
 * @swagger
 * /api/v1/staff/create-staff/{adminId}:
 *   post:
 *     summary: Create a new staff member
 *     description: Create a new staff member with the provided details
 *     tags:
 *       - Staff
 *     parameters:
 *       - name: adminId
 *         in: path
 *         description: The ID of the admin creating the staff member
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Staff'
 *     responses:
 *       201:
 *         description: Staff member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Staff'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.post('/create-staff/:adminId', authentication, createStaff);


module.exports = router;