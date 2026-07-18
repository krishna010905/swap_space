import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        price: {
            type: Number,
            required: true
        },

        orderStatus: {
            type: String,
            required: true,
            enum: ["Pending", "Accepted", "Cancelled", "Rejected"],
            default: "Pending"
        },

        orderDate: {
            type: Date,
            required: true
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },

        quantity: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Order = mongoose.model("Order", orderSchema);