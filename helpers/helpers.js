exports.PLAN_FEATURES = {
    free: {
        inventory_management: true,
        sales_tracking: true,
        expiry_alerts: true,
        reports: false,
        multi_staff: false,
        analytics_dashboard: false,
        export_reports: false
    },

    standard: {
        inventory_management: true,
        sales_tracking: true,
        expiry_alerts: true,
        reports: true,
        multi_staff: true,
        analytics_dashboard: true,
        export_reports: true
    },

    premium: {
        inventory_management: true,
        sales_tracking: true,
        expiry_alerts: true,
        reports: true,
        multi_staff: true,
        analytics_dashboard: true,
        export_reports: true,
        priority_support: true,
        api_access: true,
        multi_branch: true
    }
};


const year = new Date().getFullYear()
const month = new Date().getMonth()
const day = new Date().getDate()

exports.generateBatchCode = () => {
   return `BTH-${year}${month}${day}-`
}

// let count = 0;

// exports.padStart = (tableLength) => {
//     if (tableLength === 0) {
//         count++
//         return `00${count}`
//     } else {
//         tableLength += 4;
//         return `00${tableLength}`
//     }
//     return ""
// }

// exports.generateUserSlug = (name, tableLength) => {
//     if (name) {
//         let splitedName = name.toUpperCase().split(" ")
//         return `${splitedName[0].slice(0, 3)}-${splitedName[1].slice(0, 3)}-${exports.padStart(tableLength)}`
//     } else {
//         console.log(`Requires a string and a number as parameters!`)
//     }
//     return " "
// }

exports.padStart = (tableLength) => {
    return (tableLength + 1).toString().padStart(3, '0');
};

exports.generateUserSlug = (name, tableLength) => {
    if (typeof name !== 'string') {
        throw new Error('Name must be a string');
    }

    const parts = name.trim().toUpperCase().split(/\s+/);

    if (parts.length < 2) {
        return `${parts[0].slice(0, 3)}-INV-${exports.padStart(tableLength)}`;
    }

    return `${parts[0].slice(0, 3)}-${parts[1].slice(0, 3)}-${exports.padStart(tableLength)}`;
};

exports.mapPricesAndAdd = (serviceArray) => {
    const servicePrices = serviceArray.map(service => service.totalStock)
    return servicePrices.reduce((acc, curr) => acc + curr, 0)
}
exports.mapPricesAndAddSale = (serviceArray) => {
    const servicePrices = serviceArray.map(service => service.totalAmount)
    return servicePrices.reduce((acc, curr) => acc + curr, 0)
}

const staffModel = require('../models/staff')

exports.filterRole = async (id, role) => {
    console.log(id)
    if (role === 'admin') {
        return id;
    }

    const staff = await staffModel.findById(id);
    if (!staff || !staff.adminId) {
        throw new Error('Staff or associated supermarket not found');
    }

    return staff.adminId;
}



exports.findStaff = async (id) => {
    const staff =  await staffModel.findById(id)
    return staff.firstName
}

// const logActivity = async () => {

// }


// let description = '';

// switch (action) {
//     case 'PRODUCT_CREATED':
//         description = `${role} created product ${details.name}`;
//         break;

//     case 'SALE_COMPLETED':
//         description = `${role} completed sale worth ₦${details.totalAmount}`;
//         break;

//     case 'STAFF_CREATED':
//         description = `${role} invited new staff ${details.staffName}`;
//         break;

//     case 'CATEGORY_CREATED':
//         description = `${role} created category ${details.categoryName}`;
//         break;

//     default:
//         description = `${role} performed ${action}`;
// }

const ActivityLog = require('../models/activityLog');

exports.logActivity = async ({
    supermarket,
    user,
    title,
    module,
    description,
    amount = null,
    entityId = null,
    action = null,
    entity = null 
}) => {
    await ActivityLog.create({
        supermarket,
        user,
        action: action || title,
        module,
        entity: entity || module,
        description,
        amount,
        entityId
    });
};
