import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const getAllPreviousMessages = asyncHandler(async (req, res) => {
    // console.log("User from Middleware:", req.user);

    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Authentication required to view messages");
    }
    // console.log(req)
    // console.log(req.body)
    const { sender, receiver } = req.body;

    // console.log(sender);
    // console.log(receiver);

    if (req.user._id!=sender) {
        throw new ApiError(401, "Authentication required to view messages");
    }

    const messages = await Message.aggregate([
        {
            $match: {
                $or: [
                    { sender: new mongoose.Types.ObjectId(sender), receiver: new mongoose.Types.ObjectId(receiver) },
                    { sender: new mongoose.Types.ObjectId(receiver), receiver: new mongoose.Types.ObjectId(sender) }
                ]
            }
        },
        { $sort: { createdAt: 1 } }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            messages,
            "Message history retrieved successfully"
        )
    );
});

const sendMessage = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Authentication required to send messages.");
    }

    const { sender, receiver, message } = req.body;

    if (req.user._id!=sender) {
        throw new ApiError(401, "Authentication required to send messages");
    }

    if (!sender || !receiver || !message) {
        throw new ApiError(400, "Sender, receiver, and message are required.");
    }

    const newMessage = await Message.create ({
        sender,
        receiver,
        message,
        messageDate: new Date()
    });

    const sentMessage = await Message.findById(newMessage._id);

    if (!sentMessage){
        throw new ApiError(500, "Something went wrong while sending message.");
    }

    return res.status(201).json(
        new ApiResponse(200, sentMessage, "Message Sent Successfully")
    )
})

export {sendMessage, getAllPreviousMessages}