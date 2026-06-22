const InventoryModel = require('../models/inventory');
const SupermarketModel = require('../models/supermarket');
const CategoryModel = require('../models/category');
const { generateBatchCode, padStart, generateUserSlug, filterRole, logActivity } = require('../helpers/helpers');
const staffModel = require('../models/staff');
const BatchModel = require('../models/batch');
const ProductModel = require('../models/product');



exports.addProducts = async (req, res, next) => {
    try {
        console.log(req.user);
        const {role, id} = req.user;
        console.log(role)
        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).json({
                message: `You are not authorised to perform this action!`
            })
        };
        const supermarketId = await filterRole(id, role);
       
        const { 
            productName,
            categoryId,
            packageType,
            packageQuantity,
            unitPerPackage,
            unitPrice,
            expiryDate
        } = req.body;

        
        const ifCategory = await CategoryModel.findOne({ _id: categoryId, supermarketId })
        console.log(ifCategory)
        if (!ifCategory) {
            return res.status(404).json({
                message: `Category not found!`
            })
        }

        const ifProduct = await ProductModel.findOne({ productName: productName, supermarketId })
        console.log(ifProduct)
        if (ifProduct) {
            return res.status(400).json({
                message: `Product details already exist. Please move to ... to update the product`
            })
        }

        const productCount = await BatchModel.countDocuments()
        console.log(productCount)
        const productId = generateUserSlug(productName, productCount)
        console.log(productId)
        const code = `${generateBatchCode()}${padStart(productCount)}`;
        console.log(code)

        // const checkProduct = await InventoryModel.
        

        const product = {
            supermarketId,
            productName,
            categoryId,
            SKU: productId,
            categoryName: ifCategory.categoryName,
            batchCode: code,
            packageType,
            packageQuantity,
            unitPerPackage,
            unitPrice,
            createdBy: id
        }
        const newProduct = new ProductModel(product)
        console.log(`PRODUCT: `, newProduct)
        await newProduct.save()

        const inventoryInput = {
            supermarketId,
            productId: newProduct._id,
            productName: newProduct.productName,
            SKU: newProduct.SKU,
            categoryName: newProduct.categoryName,
            totalStock: unitPerPackage * packageQuantity,
            // availableStock: unitPerPackage * packageQuantity,
            reservedStock: 0,
            updatedBy: id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
        }
        const newInventoryInput = new InventoryModel(inventoryInput);
        await newInventoryInput.save()
        console.log(`INVENTORY: `, inventoryInput)

        const batch = {
            supermarketId,
            inventoryId: newInventoryInput._id,
            productId: newProduct._id,
            batchCode: code,
            quantity: unitPerPackage * packageQuantity,
            quantityRemaining: unitPerPackage * packageQuantity,
            unitCost: newProduct.unitPrice,
            expiryDate,
            createdBy: id
        }

        const newBatch = new BatchModel(batch);
        await newBatch.save()
        console.log(`BATCH: `, batch)

        await logActivity({
            supermarket: supermarketId,
            user: req.user.id,
            title: 'Created product',
            module: 'INVENTORY',
            description: `Added ${newProduct.productName} with ${newBatch.quantity} units`,
            entityId: newProduct._id
        });

        res.status(201).json({
            message: `Product added sucessfully`,
            data: {
                productDetails: newProduct,
                inventory: newInventoryInput,
                batch: newBatch
            }
        })


    } catch (error) {
        console.log(error)
        next(error)
    }
} 

exports.moveProducts = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).json({
                message: `You are not authorised to perform this action`
            })
        }

        const supermarketId = await filterRole(id, role);
        console.log(supermarketId)

        const { actionType, moveFrom, moveTo, quantity } = req.body;
        const { inventoryId } = req.params;

        const inventory = await InventoryModel.findOne({ _id: inventoryId, supermarketId });
        if (!inventory) {
            return res.status(404).json({
                message: `product does not exist or has been changed`
            })
        }

        const product = await ProductModel.findOne({ _id: inventory.productId, supermarketId });
        if (!product) {
            return res.status(404).json({
                message: `Product not found`
            })
        }

        const oldQuantity = inventory.availableStock || 0;

        console.log(inventory)

        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        inventory.availableStock = inventory.availableStock || 0;
        inventory.reservedStock = inventory.reservedStock || 0;

        if (moveFrom.toLowerCase() === 'all stock' && moveTo.toLowerCase() === 'available stock') {

            if (inventory.availableStock + quantity > inventory.totalStock) {
                return res.status(400).json({
                    message: `Not enough products`
                });
            }

            inventory.availableStock += quantity;
            inventory.reservedStock = inventory.totalStock - inventory.availableStock;

        } else if (moveFrom.toLowerCase() === 'reserved stock' && moveTo.toLowerCase() === 'available stock') {

            if (inventory.reservedStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products`
                });
            }

            inventory.reservedStock -= quantity;
            inventory.availableStock += quantity;

        } else if (moveFrom.toLowerCase() === 'available stock' && moveTo.toLowerCase() === 'reserved stock') {

            if (inventory.availableStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products`
                });
            }

            inventory.availableStock -= quantity;
            inventory.reservedStock += quantity;
        }
        console.log(inventory);
        await inventory.save();

        const newQuantity = inventory.availableStock || 0;
        await logActivity({
            supermarket: supermarketId,
            user: id,
            title: 'Updated stock',
            module: 'INVENTORY',
            description: `Adjusted ${product.productName} quantity from ${oldQuantity} to ${newQuantity} units`,
            entityId: product._id
        });

        res.status(200).json({
            message: `Items moved sucesfully`,
            data: inventory
        })
    } catch (error) {
        console.log(error),
        next(error)
    }
}

exports.getAllItems = async (req, res, next) => {
   try { 
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const items = await InventoryModel.find({ supermarketId });

        if (!items) {
            return res.status(404).json({
                message: `Nothing found here. Please upload your products`
            })
        }

        res.status(200).json({
            message: `Product details fetched sucessfully`,
            data: items
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// exports.recordStockEntry = async (req, res, next) => {
//     try {
//         const { id, role } = req.user;

//         if (role !== 'admin' && role !== 'manager') {
//             return res.status(403).json({
//                 message: `You are not authorised to perform this action!`
//             })
//         };
//         const supermarketId = await filterRole(id, role);

//         const {
//             productId,
//             supplier,
//             expiryDate,
//             packageType,
//             packageQuantity,
//             unitPerPackage,
//             availableStock,
//             reservedStock,
//         } = req.body;

//         const totalIncomingStock = unitPerPackage * packageQuantity;

//         // Block invalid stock allocation
//         if ((availableStock + reservedStock) > totalIncomingStock) {
//             return res.status(400).json({
//                 message: `Allocated stock exceeds total incoming stock`
//             });
//         }

//         // Block incomplete allocation
//         if ((availableStock + reservedStock) < totalIncomingStock) {
//             return res.status(400).json({
//                 message: `Stock allocation is incomplete. Remaining ${
//                     totalIncomingStock - (availableStock + reservedStock)
//                 } units unallocated`
//             });
//         }



//         const inventoryItem = await InventoryModel.findOne({ productId: productId, supermarketId })
//         const previousStock = inventoryItem?.totalStock;
//         console.log(inventoryItem)
//         if (!inventoryItem) {
//             return res.status(404).json({
//                 message: `Product not found`
//             })
//         }
//         const checkProduct = await ProductModel.findOne({ _id: inventoryItem.productId, supermarketId })
//         const productCount = await BatchModel.countDocuments()
//         console.log(productCount)

//         const code = `${generateBatchCode()}${padStart(productCount)}`;
//         console.log(code)

//         const newBatch = new BatchModel({
//             supermarketId,
//             inventoryId: inventoryItem._id,
//             productId: inventoryItem.productId,
//             batchCode: code,
//             supplier,
//             quantity: totalIncomingStock,
//             quantityRemaining: totalIncomingStock,
//             unitCost: checkProduct.unitPrice,
//             expiryDate,
//             createdBy: id
//         })

//         console.log(newBatch)
//         await newBatch.save()
        
//         inventoryItem.totalStock += newBatch.quantity;
//         inventoryItem.availableStock += availableStock;
//         inventoryItem.reservedStock += reservedStock;

//         await inventoryItem.save()
        
//         await logActivity({
//             supermarket: supermarketId,
//             user: id,
//             title: 'Recorded delivery',
//             module: 'INVENTORY',
//             description: `Received ${totalIncomingStock} units of ${checkProduct.productName} from ${supplier}`,
//             entityId: newBatch._id
//         });

//         res.status(201).json({
//             message: `Done`,
//             data: {
//                 newBatch,
//                 product: inventoryItem, 
//                 success: {
//                     message: `Stock Entry: ${totalIncomingStock} units revieved from ${supplier}`,
//                     product: checkProduct.productName,
//                     previousStock,
//                     updatedStock: inventoryItem.totalStock,
//                     availableStock: inventoryItem.availableStock,
//                     reservedStock: inventoryItem.reservedStock
//                 }
//              }
//         })


//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// }

exports.recordStockEntry = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        if (!['admin', 'manager'].includes(role)) {
            return res.status(403).json({
                message: 'You are not authorised to perform this action!'
            });
        }

        const supermarketId = await filterRole(id, role); 
        const {
            productId,
            supplier,
            expiryDate,
            packageType,
            packageQuantity,
            unitPerPackage,
            availableStock,
            reservedStock
        } = req.body;

        const totalIncomingStock = packageQuantity * unitPerPackage;
        const allocatedStock = availableStock + reservedStock;

        // Prevent over-allocation
        if (allocatedStock > totalIncomingStock) {
            return res.status(400).json({
                message: 'Allocated stock exceeds total incoming stock'
            });
        }

        // Prevent under-allocation
        if (allocatedStock < totalIncomingStock) {
            return res.status(400).json({
                message: `Stock allocation is incomplete. Remaining ${
                    totalIncomingStock - allocatedStock
                } units unallocated`
            });
        }

        const inventoryItem = await InventoryModel.findOne({
            productId,
            supermarketId
        });

        if (!inventoryItem) {
            return res.status(404).json({
                message: 'Inventory item not found'
            });
        }

        const product = await ProductModel.findOne({
            _id: productId,
            supermarketId
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found'
            });
        }

        const previousStock = inventoryItem.totalStock;

        const batchCount = await BatchModel.countDocuments({
            supermarketId
        });

        const batchCode = `${generateBatchCode()}${padStart(batchCount + 1)}`;

        const newBatch = await BatchModel.create({
            supermarketId,
            inventoryId: inventoryItem._id,
            productId,
            batchCode,
            supplier,
            packageType,
            quantity: totalIncomingStock,
            quantityRemaining: totalIncomingStock,
            unitCost: product.unitPrice,
            expiryDate,
            createdBy: id
        });

        // Update stock safely
        inventoryItem.availableStock += availableStock;
        inventoryItem.reservedStock += reservedStock;

        // Add only the new stock received
        inventoryItem.totalStock += totalIncomingStock;

        await inventoryItem.save();

        await logActivity({
            supermarket: supermarketId,
            user: id,
            title: 'Recorded delivery',
            module: 'INVENTORY',
            description: `Received ${totalIncomingStock} units of ${product.productName} from ${supplier}`,
            entityId: newBatch._id
        });

        res.status(201).json({
            message: 'Stock entry recorded successfully',
            data: {
                batch: newBatch,
                inventory: inventoryItem,
                summary: {
                    message: `Stock Entry: ${totalIncomingStock} units received from ${supplier}`,
                    product: product.productName,
                    previousStock,
                    updatedStock: inventoryItem.totalStock,
                    availableStock: inventoryItem.availableStock,
                    reservedStock: inventoryItem.reservedStock
                }
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
