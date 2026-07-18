import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uploadProfileImageOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { transporter } from "../utils/emailSender.js";

import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user) {
            throw new ApiError('User not found while generating tokens', 404);
        }
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating Tokens during Login");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body
    console.log("email: ", email);

    if([name, email, password].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({email})

    if (existedUser) {
        throw new ApiError(409, "User with E-mail already exists");
    }

    const user = await User.create({
        name, 
        email, 
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-passowrd -refreshToken"
    )

    if (!createdUser){
        throw new ApiError(404, "Something went wrong while registering the user.");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

}) 

const loginUser = asyncHandler(async (req, res) => {

    const { email, password  } = req.body;

    if(!email){
        throw new ApiError(400, "Username or Email is required");
    }

    if(!password){
        throw new ApiError(400, "Password is required");
    }
    console.log(email);
    const user = await User.findOne({email: email.toLowerCase()})

    if(!user){
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
    if(!accessToken){
        throw new ApiError(500, "Failed to generate access token");
    }
    if(!refreshToken){
        throw new ApiError(500, "Failed to generate refresh token");
    }

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        // expires: new Date(Date.now() + 30 * 24 * 60 * 60
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully",
        )
    )



})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1   
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))

})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError('No refresh token provided', 401);
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError('User not found while refreshing token', 404);
        }
        
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError('Refresh token is expired', 401);
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,
                    refreshToken: newrefreshToken
                },
                "Refresh token generated successfully",
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const {oldPassword, newPassword} = req.body

    const user = User.findById(req.user?._id)
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
    
    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid Old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password changed successfully"
    ))
})


const changePassword = asyncHandler(async (req, res) => {
    const {email, newPassword} = req.body
    console.log(email, newPassword)

    const user = await User.findOne({email})
    
    if(!user) {
        throw new ApiError(404, "User not found")
    }

    // user.password = newPassword
    // await user.save({validateBeforeSave: false})
    user.set({ password: newPassword });
    await user.save();

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        {},
        "Password changed successfully"
    ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "Current User retrieved successfully"
    ))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    
    const {name, email, phoneNumber, instaID} = req.body

    if(!name || !email){
        throw new ApiError(400, "Name and Email are required")
    }

    const profileImageLocalPath = req.file?.path;
    // console.log("profileImageLocalPath: ",profileImageLocalPath);
    let profileImageURL="";
    if(profileImageLocalPath){
        const profileImage = await uploadProfileImageOnCloudinary(profileImageLocalPath);
        if(!profileImage){
            throw new ApiError(400, "Avatar Upload Failed")
        }
        else{
            profileImageURL = profileImage.url
        }
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                phoneNumber: phoneNumber,
                instaID: instaID,
                profileImage: profileImageURL,
            }
        },
        {
            new: true,
            runValidators: true 
        }
    ).select("-password -refreshToken")
    
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        updatedUser.toObject(),  // toObject is neccessary otherwise getting the  TypeError: Converting circular structure to JSON 
        "Account details updated successfully"
    ))
})


const getUserOrderHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "buyer",
                as: "orderHistory"
            }
        },
        {
            $addFields: {
                totalBuyerOrders: { $size: "$orderHistory" }
            }
        },
        {
            $lookup: {
                from: "orders",
                localField: "_id",
                foreignField: "seller",
                as: "sellerOrders"
            }
        },
        {
            $addFields: {
                totalSellerOrders: { $size: "$sellerOrders" }
            }
        },
        {
            $project: {
                orderHistory: 1,
                sellerOrders: 1,
                totalBuyerOrders: 1,
                totalSellerOrders: 1
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            user[0] || { buyerOrders: [], sellerOrders: [], totalBuyerOrders: 0, totalSellerOrders: 0 },
            "User order history retrieved successfully"
        )
    );
});


const getUserProductHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "owner",
                as: "productHistory"
            }
        },
        {
            $addFields: {
                totalProducts: { $size: "$productHistory" }
            }
        },
        {
            $project: {
                productHistory: 1,
                totalProducts: 1,
            }
        }
    ]);

    return res.status(200).json(
        new ApiResponse(
            200,
            user[0] || { productHistory: [], totalproducts: 0 },
            "User products history retrieved successfully"
        )
    );
});



const getUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const userProfile = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "owner",
                as: "productHistory"
            }
        },
        {
            $lookup: {
                from: "orders",
                let: { userId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    { $eq: ["$buyer", "$$userId"] },
                                    // { $eq: ["$seller", "$$userId"] }
                                ]
                            }
                        }
                    },
                    {
                        $sort: {
                            "createdAt": -1
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            localField: "product",
                            foreignField: "_id",
                            as: "productDetails"
                        }
                    },
                    {
                        $unwind: "$productDetails"
                    }
                ],
                as: "orderHistory"
            }
        },
        {
            $addFields: {
                totalProducts: { $size: "$productHistory" },
                availableProducts: {
                    $size: {
                        $filter: {
                            input: "$productHistory",
                            as: "product",
                            cond: { $eq: ["$$product.productStatus", "Available"] }
                        }
                    }
                },
                totalBuyerOrders: {
                    $size: {
                        $filter: {
                            input: "$orderHistory",
                            as: "order",
                            cond: { $eq: ["$$order.buyer", "$_id"] }
                        }
                    }
                },
                totalSellerOrders: {
                    $size: {
                        $filter: {
                            input: "$orderHistory",
                            as: "order",
                            cond: { $eq: ["$$order.seller", "$_id"] }
                        }
                    }
                },
                totalRevenue: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$orderHistory.orderStatus", "Accepted"] },
                            then: "$orderHistory.price",
                            else: 0
                        }
                    }
                }
            }
        },
        {
            $project: {
                name: 1,
                email: 1,
                phoneNumber: 1,
                instaID: 1,
                productHistory: 1,
                orderHistory: 1,
                // verifiedProfile: 1,
                totalProducts: 1,
                availableProducts: 1,
                totalBuyerOrders: 1,
                totalSellerOrders: 1,
                totalRevenue: 1,
                createdAt: 1,
                profileImage: 1,
            }
        }
    ]);

    if (!userProfile || userProfile.length === 0) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200, 
            userProfile[0], 
            "User profile retrieved successfully"
        )
    );
});

const getUserData = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(
            200, 
            user, 
            "User profile retrieved successfully"
        )
    );
})

const test = asyncHandler(async (req, res) => {
    try {
        return res.status(200).json({
          success: true,
          message: "API is working correctly"
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message || "Something went wrong"
        });
      }
})

const sendOTP = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Your OTP Code for SwapSpace',
            text: `${otp} is the required OTP code for SwapSpace. It will expire in 10 minutes.`
        };

        const response = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + response.response);
        return res
        .status(200)
        .json(
          new ApiResponse(200, { otp: otp }, "OTP sent successfully")
        ) 
    } catch (error) {
        // console.log('Error sending email:', error);
        throw new ApiError(400, error?.message || "Error sending email")
    }
})

const verifyOTP = asyncHandler(async (req, res) => {
    const {otp, OTP} = req.body;
    const otpNumber = Number(otp);
    const OTPNumber = Number(OTP);
    if (otpNumber !== OTPNumber) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });
    }
    try {
        return res
        .status(200)
        .json(
            new ApiResponse(200, { }, "OTP verified successfully")
        ) 
    } catch (error) {
        throw new ApiError(500, "Something went wrong")
    }
})

const sendReview = asyncHandler(async (req, res) => {
    const {name, email, subject, message} = req.body;
    try {
        const mailOptions = {
            from: process.env.EMAIL,
            to: 'abhimamyuji@gmail.com',
            subject: `SwapSpace Review from ${name} for ${subject}`,
            text: `Sender's Name: ${name} \n\n Sender's Email: ${email} \n\n Sender's Subject: ${subject} \n\n Sender's Message: ${message}`
        };
        const response = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + response.response);
        return res
        .status(200)
        .json(
          new ApiResponse(200, {},  "Response sent successfully")
        ) 
    } catch (error) {
        // console.log('Error sending email:', error);
        throw new ApiError(400, error?.message || "Error sending email")
    }
})

export {
    registerUser, 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    getCurrentUser, 
    changeCurrentPassword, 
    updateAccountDetails,
    getUserOrderHistory, 
    getUserProductHistory, 
    getUserProfile,
    test,
    sendOTP,
    verifyOTP,
    getUserData,
    sendReview,
    changePassword
}








