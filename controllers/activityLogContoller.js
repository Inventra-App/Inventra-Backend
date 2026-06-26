const ActivityLog = require('../models/activityLog');
const { filterRole } = require('../helpers/helpers');
const InventoryModel = require('../models/inventory');

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
        .sort({ createdAt: -1 });

        console.log(logs)

        res.status(200).json({
            message: 'Activity logs fetched successfully',
            data: logs
        });

    } catch (error) {
        console.log(error);
        next(error);    
    }
};

exports.getStockMovementLog = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).json({
                message: `You are not authorised to perform this action`
            })
        }
        
        const { inventoryId } = req.params;

        const getInventoryInfo = await InventoryModel.findById(inventoryId)
        const invId = getInventoryInfo.productId;
        
        const allActions = await ActivityLog.find({action: 'Updated stock', entityId: invId})
        
        res.status(200).json({
            message: `Movement History fetched successfully`,
            data: allActions
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
};