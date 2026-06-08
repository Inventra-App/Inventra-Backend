const router = require('express').Router();

const { createSubscriptionPlan } = require('../controllers/subscriptionPlanController');
const suthentication = require('../middlewares/auth');

router.post('/sub-plan', createSubscriptionPlan);

module.exports = router;

