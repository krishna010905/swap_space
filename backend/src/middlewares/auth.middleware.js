import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        
        if (!token) {
            throw new ApiError(401, "Unauthorised reuqest")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
        if (!user) {
            throw new ApiError(401, "User not found")
        }
    
        req.user = user;
        // console.log("Authenticated User:", {
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email
        // });
        next()    
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})
