const saleModel = require('../models/sale');
const SaleItemModel = require('../models/saleItem');
const ProductModel = require('../models/product');
const InventoryModel = require('../models/inventory');
const BatchModel = require('../models/batch');
const { filterRole, padStart, mapPricesAndAdd, mapPricesAndAddSale } = require('../helpers/helpers');

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

            const product = await ProductModel.findById(productId);
            // console.log(product)
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            const inventory = await InventoryModel.findOne({productId: productId});
            console.log(inventory)
            if ( inventory.availableStock < quantity ) {
                return res.status(400).json({
                    message: `${product.productName} out of stock`
                });
            }

            const subtotal = product.unitPrice * quantity;

            totalAmount += subtotal;

            inventory.availableStock -= quantity;
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
        const saleCount = await saleModel.countDocuments()
        const saleNumber = padStart(saleCount)

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
        const totalSales = await saleModel.countDocuments();

        if (!totalSales) {
            return res.status(404).json({
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
exports.countSalesAmount = async (req, res, next) => {
    try {
        const salesAmount = await saleModel.find();
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