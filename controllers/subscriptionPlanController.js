const SubscriptionPlan = require('../models/subscriptionPlan');
const { PLAN_FEATURES } = require('../helpers/helpers');
exports.createSubscriptionPlan = async (req, res, next) => {
    console.log('hello')
    try {
        const {
            subscriptionName,
            price,
            billingCycle,
            maxStaff,
        } = req.body;   

        const newSubscriptionPlan = new SubscriptionPlan({
           subscriptionName,
           price,
           billingCycle,
           maxStaff,
           features_Json: PLAN_FEATURES[subscriptionName.toLowerCase()]
       }) 
       await newSubscriptionPlan.save();
       console.log(newSubscriptionPlan)
        

        res.status(201).json({
            message: 'subscription plan created successfully',
            data: newSubscriptionPlan
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}