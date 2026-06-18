const router = require('express').Router();
const { receiveContactRequest } = require('../controllers/contactUs');
const { contactUsValidator } = require('../middlewares/validator');

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact form submissions
 */

/**
 * @swagger
 * /api/v1/contact-us:
 *   post:
 *     tags: [Contact]
 *     summary: Submit a contact request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - email
 *               - phoneNumber
 *               - message
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               message:
 *                 type: string
 *                 example: "I need help with my account."
 *     responses:
 *       201:
 *         description: Contact request submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error
 */
router.post('/contact-us',contactUsValidator, receiveContactRequest);

module.exports = router;
