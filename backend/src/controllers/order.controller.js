import mongoose from 'mongoose'; 
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const placeOrder = asyncHandler(async (req, res) => {
    const { buyer, seller, product, quantity, price } = req.body;
    const order = await Order.create({
        price,
        quantity,
        buyer,
        seller,
        product,
        orderDate: new Date(),
    })

    const createdOrder = await Order.findById(order._id)
    .populate('product', 'name')
    .populate('buyer', 'name email')
    .populate('seller', 'name email');

    const updatedproduct = await Product.findByIdAndUpdate(
        product,
        {productStatus:"Ordered"},
        { new: true }
    )
    
    if (!createdOrder){
        throw new ApiError(404, "Something went wrong while placing order.");
    }

    if (!updatedproduct){
        throw new ApiError(404, "Something went wrong while placing order.");
    }

    return res.status(201).json(
        new ApiResponse(200, createdOrder, "Order Placed Successfully")
    )
    
});



const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId, productId } = req.body;
    console.log('Cancel Order Inputs:', { orderId, productId });
    const cancelledOrder = await Order.findByIdAndUpdate(
        orderId,
        {orderStatus: "Cancelled"},
        { new: true }
    )

    const updatedproduct = await Product.findByIdAndUpdate(
        productId,
        {productStatus:"Available"},
        { new: true }
    )
    
    if (!cancelledOrder){
        console.error('Order not found or update failed');
        throw new ApiError(404, "Something went wrong while cancelling order.");
    }
    if (!updatedproduct){
        console.error('Product update failed');
        throw new ApiError(404, "Something went wrong while cancelling order.");
    }
    
    return res.status(200).json(
        new ApiResponse(200, cancelledOrder, "Order Cancelled Successfully")
    )
    
});

const getProductOrders = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    // console.log(productId);
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json(
            new ApiError(404, "Product not found")
        );
    }

    // console.log(product);

    const orders = await Order.aggregate([
        {
            $match: { 
                product: new mongoose.Types.ObjectId(productId),
                orderStatus: "Pending" 
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "buyer",
                foreignField: "_id",
                as: "buyerDetails"
            }
        },
        {
            $unwind: "$buyerDetails"
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 1,
                orderStatus: 1,
                buyer: 1,
                buyerDetails: 1,
                product: 1
            }
        }
        
    ]) 


    
    return res.status(200).json(
        new ApiResponse(200, orders, "Product orders retrieved successfully")
    );

});

const getProductAllOrders = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    // console.log(productId);
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json(
            new ApiError(404, "Product not found")
        );
    }

    // console.log(product);

    const orders = await Order.aggregate([
        {
            $match: { 
                product: new mongoose.Types.ObjectId(productId),
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "buyer",
                foreignField: "_id",
                as: "buyerDetails"
            }
        },
        {
            $project: {
                _id: 1,
                orderStatus: 1,
                buyer: 1,
                product: 1
            }
        } 
    ]) 


    
    return res.status(200).json(
        new ApiResponse(200, orders, "Product orders retrieved successfully")
    );

});


const acceptOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json(
            new ApiError(404, "Order not found")
        );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set: { 
                orderStatus: "Accepted" 
            },
        },
        {
            new: true
        }
    )

    if (!updatedOrder) {
        return res.status(404).json(
            new ApiError(400, "Order not updated")
        );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        order.product,
        {
            $set: { 
                productStatus: "Sold" 
            },
        },
        {
            new: true
        }
    );

    if (!updatedProduct) {
        return res.status(404).json(
            new ApiError(400, "Product not updated")
        );
    }
   
    return res.status(200).json(
        new ApiResponse(200, updatedOrder, "Order accepted successfully")
    );
});


const rejectOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).json(
            new ApiError(404, "Order not found")
        );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
            $set: { 
                orderStatus: "Rejected" 
            },
        },
        {
            new: true
        }
    )

    if (!updatedOrder) {
        return res.status(404).json(
            new ApiError(400, "Order not updated")
        );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        order.product,
        {
            $set: { 
                productStatus: "Available" 
            },
        },
        {
            new: true
        }
    );

    if (!updatedProduct) {
        return res.status(404).json(
            new ApiError(400, "Product not updated")
        );
    }
   
    return res.status(200).json(
        new ApiResponse(200, updatedOrder, "Order accepted successfully")
    );
});



export { placeOrder, cancelOrder, acceptOrder, getProductOrders, rejectOrder, getProductAllOrders}