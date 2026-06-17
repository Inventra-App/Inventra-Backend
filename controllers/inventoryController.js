const InventoryModel = require('../models/inventory');
const SupermarketModel = require('../models/supermarket');
const CategoryModel = require('../models/category');
const { generateBatchCode, padStart, generateUserSlug, filterRole } = require('../helpers/helpers');
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

        
        const ifCategory = await CategoryModel.findById(categoryId)
        console.log(ifCategory)
        if (!ifCategory) {
            return res.status(404).json({
                message: `Category not found!`
            })
        }

        const ifProduct = await ProductModel.findOne({productName: productName})
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
           if (role === 'admin' && role === 'sales') {
            return res.status(403).json({
                message: `You are not authorised to perform this action`
            })
        }

        const supermarketId = await filterRole(id, role);
        console.log(supermarketId)

        const { actionType, moveFrom, moveTo, quantity } = req.body;
        const { inventoryId } = req.params;

        const inventory = await InventoryModel.findById(inventoryId);
        if (!inventory) {
            return res.status(404).json({
                message: `product does not exist or has been changed`
            })
        }

        console.log(inventory)

        if (moveFrom.toLowerCase() === 'all stock' && moveTo.toLowerCase() === 'available stock') {
            if (inventory.totalStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products`
                })
            }
            inventory.availableStock += quantity;
            inventory.reservedStock += inventory.totalStock - quantity
        } else if (moveFrom.toLowerCase() === 'reserved stock' && moveTo.toLowerCase() === 'available stock') {
            if (inventory.reservedStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products`
                })
            } 
            inventory.reservedStock -= quantity;
            inventory.availableStock += quantity;
        } else if (moveFrom.toLowerCase() === 'available stock' && moveTo.toLowerCase() === 'reserved stock') {
            if (inventory.availableStock < quantity) {
                return res.status(400).json({
                    message: `Not enough products`
                })
            }
            inventory.availableStock -= quantity;
            inventory.reservedStock += quantity;
        }
        console.log(inventory);
        await inventory.save();

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
        const items = await InventoryModel.find();

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

exports.recordStockEntry = async (req, res, next) => {
    try {
        const { id, role } = req.user;

        if (role !== 'admin' && role !== 'manager') {
            return res.status(403).json({
                message: `You are not authorised to perform this action!`
            })
        };
        const supermarketId = await filterRole(id, role);

        const {
            productId,
            supplier,
            expiryDate,
            packageType,
            packageQuantity,
            unitPerPackage,
            availableStock,
            reservedStock,
        } = req.body;

        const totalIncomingStock = unitPerPackage * packageQuantity;

        // Block invalid stock allocation
        if ((availableStock + reservedStock) > totalIncomingStock) {
            return res.status(400).json({
                message: `Allocated stock exceeds total incoming stock`
            });
        }

        // Block incomplete allocation
        if ((availableStock + reservedStock) < totalIncomingStock) {
            return res.status(400).json({
                message: `Stock allocation is incomplete. Remaining ${
                    totalIncomingStock - (availableStock + reservedStock)
                } units unallocated`
            });
        }



        const inventoryItem = await InventoryModel.findOne({productId: productId})
        const previousStock = inventoryItem.totalStock;
        console.log(inventoryItem)
        if (!inventoryItem) {
            return res.status(404).json({
                message: `Product not found`
            })
        }
        const checkProduct = await ProductModel.findById(inventoryItem.productId)
        const productCount = await BatchModel.countDocuments()
        console.log(productCount)

        const code = `${generateBatchCode()}${padStart(productCount)}`;
        console.log(code)

        const newBatch = new BatchModel({
            supermarketId,
            inventoryId: inventoryItem._id,
            productId: inventoryItem.productId,
            batchCode: code,
            supplier,
            quantity: totalIncomingStock,
            quantityRemaining: totalIncomingStock,
            unitCost: checkProduct.unitPrice,
            expiryDate,
            createdBy: id
        })

        console.log(newBatch)
        await newBatch.save()
        
        inventoryItem.totalStock += newBatch.quantity;
        inventoryItem.availableStock += availableStock;
        inventoryItem.reservedStock += reservedStock;

        await inventoryItem.save()
        


        res.status(201).json({
            message: `Done`,
            data: {
                newBatch,
                product: inventoryItem, 
                success: {
                    message: `Stock Entry: ${totalIncomingStock} units revieved from ${supplier}`,
                    product: checkProduct.productName,
                    previousStock,
                    updatedStock: inventoryItem.totalStock,
                    availableStock: inventoryItem.availableStock,
                    reservedStock: inventoryItem.reservedStock
                }
             }
        })


    } catch (error) {
        console.log(error)
        next(error)
    }
}
