const ActivityLog = require('../models/activityLog');
const { filterRole } = require('../helpers/helpers');

exports.getActivityDescriptions = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);

        const activityLogs = await ActivityLog.find({ supermarket: supermarketId }).select('description -_id').lean();
        const descriptions = activityLogs.map(log => log.description);

        res.status(200).json({
            message: 'Activity descriptions fetched successfully',
            data: descriptions
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getActivityLog = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);

        const logs = await ActivityLog.find({
            supermarket: supermarketId
        })
        .populate('user', 'firstName lastName')
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Activity logs fetched successfully',
            data: logs
        });

    } catch (error) {
        console.log(error);
        next(error);    
    }
};