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

        const productCount = await ProductModel.countDocuments()
        console.log(productCount)
        const productId = generateUserSlug(productName, productCount)
        console.log(productId)
        const code = `${generateBatchCode()}${padStart(productCount)}`;
        console.log(code)

        // const checkProduct = await InventoryModel.
        

        const product = {
            supermarketId: id,
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
            supermarketId: id,
            productId: newProduct._id,
            productName: newProduct.productName,
            categoryName: newProduct.categoryName,
            totalStock: unitPerPackage * packageQuantity,
            updatedBy: id
        }
        const newInventoryInput = new InventoryModel(inventoryInput)
        await newInventoryInput.save()
        console.log(`INVENTORY: `, inventoryInput)

        const batch = {
            supermarketId: id,
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
            inventory.availableStock = quantity;
            inventory.reservedStock = inventory.totalStock - quantity
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