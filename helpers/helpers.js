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
   return `BTH-${year}0${month}0${day}-`
}

