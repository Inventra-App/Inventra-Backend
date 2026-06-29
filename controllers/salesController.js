const mongoose = require('mongoose');
const saleModel = require('../models/sale');
const SaleItemModel = require('../models/saleItem');
const ProductModel = require('../models/product');
const InventoryModel = require('../models/inventory');
const BatchModel = require('../models/batch');
const { filterRole, padStart, mapPricesAndAdd, mapPricesAndAddSale, logActivity, generateUserSlug, findStaffInfo, sellFifoIterative} = require('../helpers/helpers');
const { getPagination } = require('../helpers/pagination');
const SupermarketModel = require('../models/supermarket');

// exports.createSale = async (req, res, next) => {
//     try {
//         const { id, role } = req.user;
//         if (role === 'admin' && role === 'sales') {
//             return res.status(403).json({
//                 message: `You are not authorised to perform this action`
//             })
//         }

//         const supermarketId = await filterRole(id, role);
//         console.log(supermarketId)

//         const {
//             items,
//             quantity
//         } = req.body;

//         const product = await ProductModel.findById(productId)
//         const productName = product.productName;
//         const unitPrice = product.unitPrice;
//         const subtotal = quantity * unitPrice;
//         const cartTable = await CartModel.countDocuments()

//         const cartNumber = `cart-${padStart(cartTable)}`
//         console.log(cartNumber)

//         const cart = new CartModel({
//             supermarketId,
//             cashierId: id,
//             cartNumber,
//         })
//         console.log(cart)
//         await cart.save()

//         const item = new CartItemModel({
//             cartId: cart._id,
//             productId,
//             productName,
//             quantity,
//             unitPrice,
//             subtotal
//         })

//         console.log(item)

//         // const updateCart = await CartModel.findByIdAndUpdate
//         cart.status = 'checked-out';
//         cart.totalAmount = mapPricesAndAddCart(await CartItemModel.find({where: {cartId: cart._id}}));
//         cart.totalItems = await CartItemModel.find({where: {cartId: cart._id}}).countDocuments();
//         await cart.save()
//         console.log(cart)

//         res.status(200).json({
//             message: `Posted sales`,
//             data: {
//                 cart,
//                 item
//             }
//         })


//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// }

exports.checkoutSale = async (req, res, next) => {
    try {
        const { items, paymentMethod } = req.body;
        const { id, role } = req.user;

        if (role !== 'admin' && role !== 'cashier') {
            return res.status(403).json({
                message: `You are not authorised to perform this action`
            })
        }

        const supermarketId = await filterRole(id, role);
        // console.log(supermarketId)
        // console.log(items)
        let totalAmount = 0; 
        const saleItems = [];
        let count = 0;

        for (const item of items) {
            const { productId, quantity } = item; 

            const product = await ProductModel.findOne({ _id: productId, supermarketId });
            // console.log(product)
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const inventory = await InventoryModel.findOne({ productId: productId, supermarketId });
            console.log(inventory)
            if ( inventory.availableStock < quantity ) {
                return res.status(400).json({
                    message: `${product.productName} out of stock`
                });
            }

            const subtotal = product.unitPrice * quantity;

            totalAmount += subtotal;

            inventory.availableStock -= quantity;

            const { id } = req.params;
            const getBatches = await BatchModel.find({
                supermarketId: id,
                productId: productId
            })
            .select('quantity quantityRemaining')
            .sort({ createdAt: 1 });
        
            const updatedBatches = sellFifoIterative(quantity, getBatches);
            await BatchModel.bulkWrite(updatedBatches.map(batch => ({
                updateOne: {
                    filter: { _id: batch._id },
                    update: { $set: { quantityRemaining: batch.quantityRemaining } }
                }
                })));
                
            await inventory.save();
            saleItems.push({
                productId,
                productName: product.productName,
                quantity,
                unitPrice: product.unitPrice,
                subtotal
            });
            count ++
            console.log(inventory)
        }
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
        // console.log(totalItems)
        const saleCount = await saleModel.countDocuments({ supermarketId })
        const supermarket = await SupermarketModel.findById(supermarketId)
        const saleNumber = `${generateUserSlug(supermarket.firstName, saleCount)}`

        // console.log(saleItems)
        // console.log(count)

        const sale = await saleModel.create({
            cashierId: id,
            paymentMethod,
            totalAmount, 
            totalItems,
            supermarketId,
            saleNumber,
            items: saleItems
        });

        await SaleItemModel.insertMany(
            saleItems.map(item => ({
                saleId: sale._id,
                ...item
            }))
        );
        const userName = await findStaffInfo(id);
        
        await logActivity({
            supermarket: supermarketId,
            staffId: id,
            staffName: userName,
            title: 'Completed sale',
            module: 'SALE',
            description: `Sold ${totalItems} items for ₦${totalAmount}`,
            amount: totalAmount,
            entityId: sale._id
        });
     

        console.log(saleItems)

        res.status(201).json({
            message: "Sale successful",
            data: {
                sale,
                items: saleItems
            }
        });

    } catch (error) {
        console.log(error)
        next(error);
    }
};

exports.countSales = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const totalSales = await saleModel.countDocuments({ supermarketId });

        if (!totalSales) {
            return res.status(200).json({
                message: `Nothing sold yet. Come back when you make a sale!`
            })
        }

        res.status(200).json({
            message: `Total sales`,
            data: totalSales
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getAllSales = async (req, res, next) => {
    try {
        const { page, limit, skip } = getPagination(req);

        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const totalSales = await saleModel.countDocuments({ supermarketId });

        const sales = await saleModel.find({ supermarketId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        if (sales.length === 0) {
            return res.status(200).json({
                message: `No sales found`
            });
        }

        const totalPages = Math.ceil(totalSales / limit);

        res.status(200).json({
            message: `Sales fetched successfully`,
            data: sales,
            pagination: {
                currentPage: page,
                perPage: limit,
                totalSales,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};
exports.countSalesAmount = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const salesAmount = await saleModel.find({ supermarketId });
        const totalSalesAmount = mapPricesAndAddSale(salesAmount)
        console.log(totalSalesAmount)

        res.status(200).json({
            message: `Here's how much you've sold!`,
            data: totalSalesAmount
        })

    } catch (error) {
        console.log(error)
        next(error)
    }
}

exports.getDailySalesTotal = async (req, res, next) => {
    try {
        const { id, role } = req.user;
        const supermarketId = await filterRole(id, role);
        const { date, startDate, endDate } = req.query;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (date && !dateRegex.test(date)) {
            return res.status(400).json({
                message: 'Date must be in YYYY-MM-DD format'
            });
        }

        if (startDate && !dateRegex.test(startDate)) {
            return res.status(400).json({
                message: 'Start date must be in YYYY-MM-DD format'
            });
        }

        if (endDate && !dateRegex.test(endDate)) {
            return res.status(400).json({
                message: 'End date must be in YYYY-MM-DD format'
            });
        }

        const dailyMatch = {};
        if (date) {
            dailyMatch._id = date;
        } else {
            if (startDate) dailyMatch._id = { ...dailyMatch._id, $gte: startDate };
            if (endDate) dailyMatch._id = { ...dailyMatch._id, $lte: endDate };
        }

        const sales = await saleModel.aggregate([
            {
                $match: {
                    supermarketId: new mongoose.Types.ObjectId(supermarketId),
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$createdAt',
                            timezone: 'Africa/Lagos'
                        }
                    },
                    totalAmount: { $sum: '$totalAmount' },
                    totalSales: { $sum: 1 },
                    totalItems: { $sum: '$totalItems' }
                }
            },
            ...(Object.keys(dailyMatch).length ? [{ $match: dailyMatch }] : []),
            { $sort: { _id: -1 } },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalAmount: 1,
                    totalSales: 1,
                    totalItems: 1
                }
            }
        ]);

        res.status(200).json({
            message: 'Daily sales total fetched successfully',
            data: sales
        });

    } catch (error) {
        console.log(error)
        next(error)
    }
}
