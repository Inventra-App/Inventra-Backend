// This script normalizes line endings and applies the get-all pattern fixes
const fs = require('fs');

const staffFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/staffController.js';
let staff = fs.readFileSync(staffFile, 'utf8');
staff = staff.replace(
  "        if (!staff) {\n            return [];\n  ``      }\n\n        res.status(200).json({\n            message: 'Staff fetched successfully',\n            data: staff\n        });",
  "        res.status(200).json({\n            message: staff.length\n                ? 'Staff fetched successfully'\n                : 'No staff found',\n            data: staff\n        });"
);
fs.writeFileSync(staffFile, staff, 'utf8');
console.log('staffController.js - DONE');

const productFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/productController.js';
let product = fs.readFileSync(productFile, 'utf8');
product = product.replace(
  "        res.status(200).json({\n            message: 'All Products found successfully',\n            data: products\n        });",
  "        res.status(200).json({\n            message: products.length\n                ? 'Products fetched successfully'\n                : 'No products found',\n            data: products\n        });"
);
product = product.replace(
  "        if (!products.length) {\n            return res.status(404).json({\n                message: 'No products found for this category'\n            });\n        }\n\n        res.status(200).json({\n            message: 'Products fetched successfully',\n            total: products.length,\n            data: products\n        });",
  "        res.status(200).json({\n            message: products.length\n                ? 'Products fetched successfully'\n                : 'No products found for this category',\n            data: products\n        });"
);
fs.writeFileSync(productFile, product, 'utf8');
console.log('productController.js - DONE');

const categoryFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/categoryConroller.js';
let category = fs.readFileSync(categoryFile, 'utf8');
category = category.replace(
  "            message: allCategories.length ? `All categories fetched successfully` : `No categories found`,",
  "            message: allCategories.length\n                ? 'Categories fetched successfully'\n                : 'No categories found',"
);
fs.writeFileSync(categoryFile, category, 'utf8');
console.log('categoryConroller.js - DONE');


const inventoryFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/inventoryController.js';
let inventory = fs.readFileSync(inventoryFile, 'utf8');
inventory = inventory.replace(
  "        if (!items) {\n            return res.status(404).json({\n                message: `Nothing found here. Please upload your products`\n            })\n        }\n\n        res.status(200).json({\n            message: `Inventory item details fetched sucessfully`,\n            data: items\n        })",
  "        res.status(200).json({\n            message: items.length\n                ? 'Inventory items fetched successfully'\n                : 'No inventory items found',\n            data: items\n        })"
);
fs.writeFileSync(inventoryFile, inventory, 'utf8');
console.log('inventoryController.js - DONE');

const batchFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/batchController.js';
let batch = fs.readFileSync(batchFile, 'utf8');
batch = batch.replace(
  "         res.status(200).json({\n         message: ` All Batches found successfully`,\n         data: batches\n        })",
  "         res.status(200).json({\n         message: batches.length\n                ? 'Batches fetched successfully'\n                : 'No batches found',\n         data: batches\n        })"
);
batch = batch.replace(
  "        if(!batches || batches.length === 0){\n            return res.status(404).json({\n                message:`batch not found!`\n            })  \n        }\n\n        res.status(200).json({\n            message:`batches found successfully`,\n            data: batches\n        })",
  "        res.status(200).json({\n            message: batches.length\n                ? 'Batches found successfully'\n                : 'No batches found',\n            data: batches\n        })"
);
fs.writeFileSync(batchFile, batch, 'utf8');
console.log('batchController.js - DONE');

const salesFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/salesController.js';
let sales = fs.readFileSync(salesFile, 'utf8');
sales = sales.replace(
  "        if (sales.length === 0) {\n            return res.status(404).json({\n                message: `No sales found`\n            });\n        }\n\n        const totalPages = Math.ceil(totalSales / limit);\n\n        res.status(200).json({\n            message: `Sales fetched successfully`,\n            data: sales,\n            pagination: {",
  "        const totalPages = Math.ceil(totalSales / limit);\n\n        res.status(200).json({\n            message: sales.length\n                ? 'Sales fetched successfully'\n                : 'No sales found',\n            data: sales,\n            pagination: {"
);
fs.writeFileSync(salesFile, sales, 'utf8');
console.log('salesController.js - DONE');

const activityFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/activityLogContoller.js';
let activity = fs.readFileSync(activityFile, 'utf8');
activity = activity.replace(
  "        res.status(200).json({\n            message: 'Activity logs fetched successfully',\n            data: logs\n        });",
  "        res.status(200).json({\n            message: logs.length\n                ? 'Activity logs fetched successfully'\n                : 'No activity logs found',\n            data: logs\n        });"
);
activity = activity.replace(
  "        res.status(200).json({\n            message: `Movement History fetched successfully`,\n            data: allActions\n        })",
  "        res.status(200).json({\n            message: allActions.length\n                ? 'Movement history fetched successfully'\n                : 'No movement history found',\n            data: allActions\n        })"
);
fs.writeFileSync(activityFile, activity, 'utf8');
console.log('activityLogContoller.js - DONE');

const expiryFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/expiryController.js';
let expiry = fs.readFileSync(expiryFile, 'utf8');
expiry = expiry.replace(
  "        res.status(200).json({\n            message: 'Expiring products fetched successfully',\n            count: products.length,\n            data: products\n        });",
  "        res.status(200).json({\n            message: products.length\n                ? 'Expiring products fetched successfully'\n                : 'No expiring products found',\n            data: products\n        });"
);
fs.writeFileSync(expiryFile, expiry, 'utf8');
console.log('expiryController.js - DONE');

const lowStockFile = 'c:/Users/USER/Desktop/Inventra-Backend/controllers/lowStockController.js';
let lowStock = fs.readFileSync(lowStockFile, 'utf8');
lowStock = lowStock.replace(
  "        if (!data.length) {\n            return [];\n        }\n\n        res.status(200).json({\n            message: 'Low stock products fetched successfully',\n            count: data.length,\n            data\n        });",
  "        res.status(200).json({\n            message: data.length\n                ? 'Low stock products fetched successfully'\n                : 'No low stock products found',\n            data\n        });"
);
fs.writeFileSync(lowStockFile, lowStock, 'utf8');
console.log('lowStockController.js - DONE');

console.log('ALL DONE');
