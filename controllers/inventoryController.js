const InventoryModel = require('../models/inventory');
const SupermarketModel = require('../models/supermarket');
const CategoryModel = require('../models/category');
const { generateBatchCode, padStart, generateUserSlug, filterRole, logActivity, findStaffInfo } = require('../helpers/helpers');
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
            availableStock,
            backroomStock,
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
                message: `Product details already exist. Please go to "Manage stock" to update the product`
            })
        }

        const batchCount = await BatchModel.countDocuments({supermarketId})
        const productCount = await BatchModel.countDocuments({supermarketId})
        const productId = generateUserSlug(productName, productCount)
        console.log(productCount)
        console.log(productId)
        const code = `${generateBatchCode()}${padStart(batchCount)}`;
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
            availableStock,
            backroomStock,
            updatedBy: id,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  
        }

        console.log(inventoryInput)
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
            expiryDate: expiryDate? expiryDate: null,
            createdBy: id
        }

        const newBatch = new BatchModel(batch);
        await newBatch.save()
        console.log(`BATCH: `, batch)

        const userName = await findStaffInfo(req.user.id);
        
        await logActivity({
            supermarket: supermarketId,
            staffId: req.user.id,
            staffName: userName,
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

        if (!['admin', 'manager'].includes(role)) {
            return res.status(403).json({
                message: `You are not authorised to perform this action`
            });
        }

        const supermarketId = await filterRole(id, role);
        const userName = await findStaffInfo(id);

        const { actionType, moveFrom, moveTo, quantity } = req.body;
        const { inventoryId } = req.params;

        if (!moveFrom || !moveTo || !quantity) {
            return res.status(400).json({
                message: `Move source, destination and quantity are required`
            });
        }

        const inventory = await InventoryModel.findOne({
            _id: inventoryId,
            supermarketId
        });

        if (!inventory) {
            return res.status(404).json({
                message: `Product does not exist or has been changed`
            });
        }

        const product = await ProductModel.findOne({
            _id: inventory.productId,
            supermarketId
        });

        if (!product) {
            return res.status(404).json({
                message: `Product not found`
            });
        }

        if (quantity <= 0) {
            return res.status(400).json({
                message: `Quantity must be greater than 0`
            });
        }

        inventory.availableStock = inventory.availableStock || 0;
        inventory.backroomStock = inventory.backroomStock || 0;
        inventory.writtenOff = inventory.writtenOff || 0;

        const oldState = {
            availableStock: inventory.availableStock,
            backroomStock: inventory.backroomStock,
            writtenOffStock: inventory.writtenOff
        };

        // Prevent same source and destination
        if (moveFrom.toLowerCase() === moveTo.toLowerCase()) {
            return res.status(400).json({
                message: `Source and Destination cannot be the same`
            });
        }

        // Backroom → Available
        if (
            moveFrom.toLowerCase() === 'backroom stock' &&
            moveTo.toLowerCase() === 'available stock'
        ) {
            if (inventory.backroomStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products in backroom stock`
                });
            }

            inventory.backroomStock -= quantity;
            inventory.availableStock += quantity;
        }

        // Available → Backroom
        else if (
            moveFrom.toLowerCase() === 'available stock' &&
            moveTo.toLowerCase() === 'backroom stock'
        ) {
            if (inventory.availableStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products in available stock`
                });
            }

            inventory.availableStock -= quantity;
            inventory.backroomStock += quantity;
        }

        // Available → Write-off
        else if (
            moveFrom.toLowerCase() === 'available stock' &&
            moveTo.toLowerCase() === 'write-off stock'
        ) {
            if (inventory.availableStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products in available stock`
                });
            }

            inventory.availableStock -= quantity;
            inventory.writtenOff += quantity;
        }

        // Backroom → Write-off
        else if (
            moveFrom.toLowerCase() === 'backroom stock' &&
            moveTo.toLowerCase() === 'write-off stock'
        ) {
            if (inventory.backroomStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products in backroom stock`
                });
            }

            inventory.backroomStock -= quantity;
            inventory.writtenOff += quantity;
        }

        // Invalid movement
        else {
            return res.status(400).json({
                message: `Invalid stock movement`
            });
        }

        await inventory.save();

        const newState = {
            availableStock: inventory.availableStock,
            backroomStock: inventory.backroomStock,
            writtenOffStock: inventory.writtenOff
        };

        await logActivity({
            supermarket: supermarketId,
            staffId: id,
            staffName: userName,
            title: actionType || 'Updated stock',
            module: 'INVENTORY',
            description: `Moved ${quantity} units of ${product.productName} from ${moveFrom} to ${moveTo}`,
            entityId: product._id
        });

        res.status(200).json({
            message: `Items moved successfully`,
            data: {
                inventory,
                oldState,
                newState
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

exports.getAllItems = async (req, res, next) => {
   try { 
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const items = await InventoryModel.find({ supermarketId });
        const batches = await BatchModel.find({ supermarketId });


        if (!items) {
            return res.status(200).json({
                message: `Nothing found here. Please upload your products`
            })
        }

        res.status(200).json({
            message: `Inventory item details fetched sucessfully`,
            data: items
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
};

exports.getOneItem = async (req, res, next) => {
    try {
        const { inventoryId } = req.params;
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);

        const item = await InventoryModel.findOne({ _id: inventoryId, supermarketId });
        const batches = await BatchModel.find({ inventoryId });

        if (!item) {
            return res.status(404).json({
                message: `Inventory item not found`
            });
        }

        const isExpiring = batches.every(
            batch => batch.isExpiring === true
        );

        res.status(200).json({
            message: `Inventory item details fetched successfully`,
            data: {
                item,
                isExpiring
            }
        });


    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.restockItem = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        if (!['admin', 'manager'].includes(role)) {
            return res.status(403).json({
                message: 'You are not authorised to perform this action!'
            });
        }

        const supermarketId = await filterRole(id, role); 
        const {
            inventoryId,
            supplier,
            expiryDate,
            packageType,
            packageQuantity,
            unitPerPackage
        } = req.body;

        const totalIncomingStock = packageQuantity * unitPerPackage;

        const inventoryItem = await InventoryModel.findOne({
            _id: inventoryId,
            supermarketId
        });

        if (!inventoryItem) {
            return res.status(404).json({
                message: 'Inventory item not found'
            });
        }

        const productId = inventoryItem.productId;
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
            expiryDate: expiryDate? expiryDate: null,
            createdBy: id
        });

        inventoryItem.backroomStock += totalIncomingStock;
        await inventoryItem.save();

        const userName = await findStaffInfo(id);
        
        await logActivity({
            supermarket: supermarketId,
            staffId: id,
            staffName: userName,
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
                    backroomStock: inventoryItem.backroomStock
                }
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

