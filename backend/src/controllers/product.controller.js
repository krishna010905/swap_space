import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { getCurrentUser } from "./user.controller.js";
import { Product } from "../models/product.model.js";
import { Category } from "../models/category.model.js";
import { uploadProductImageOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const addProduct = asyncHandler(async (req, res) => {
    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Authentication required to create a product");
    }
    const { name, price, description, category, quantity } = req.body;

    if([name, description].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }
    if ((price <= 0) || (quantity <= 0)) {
        throw new ApiError(400, "Price and quantity must be greater than 0");
    }

    const categoryDoc = await Category.findOne({name:category});
    if (!categoryDoc) {
        throw new ApiError(404, "Invalid category");
    }

    const productImagePaths = req.files?.images;
    
    if (!productImagePaths || productImagePaths.length === 0) {
        throw new ApiError(400, "At least one product image is required");
    }
    
    const uploadedImages = [];
    for (const file of productImagePaths) {
        const localFilePath = file.path;
    
        const uploadedImage = await uploadProductImageOnCloudinary(localFilePath);
        if (!uploadedImage) {
            throw new ApiError(400, "Failed to upload one or more product images");
        }
    
        uploadedImages.push(uploadedImage.url); 
    }

    const product = await Product.create({
        name,
        price,
        description,
        quantity,
        productImages: uploadedImages,
        category: categoryDoc._id, 
        owner: req.user._id, 
    });

    const createdProduct = await Product.findById(product._id)
        .populate('category')
        .populate('owner', 'name email');

    if (!createdProduct){
        throw new ApiError(500, "Something went wrong while creating product.");
    }

    return res.status(201).json(
        new ApiResponse(200, createdProduct, "Product Created Successfully")
    )
})


const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, category, quantity, productImages } = req.body;

    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if (product.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not the owner of this product");
    }

    if([name, description].some(
        (field) => field?.trim() === "" )
    ){
        throw new ApiError(400, "All fields are required");
    }
    if ((price <= 0) || (quantity <= 0)) {
        throw new ApiError(400, "Price and quantity must be greater than 0");
    }

    const categoryDoc = await Category.findOne({name:category});
    if (!categoryDoc) {
        throw new ApiError(404, "Invalid category");
    }

    let uploadedImages = [];
    try {
        uploadedImages = JSON.parse(productImages || '[]');
    } catch (parseError) {
        throw new ApiError(400, "Invalid existing images format");
    }

    const productImagePaths = req.files?.images;
    
    if (productImagePaths && productImagePaths.length !== 0) {
        for (const file of productImagePaths) {
            const localFilePath = file.path;
            const uploadedImage = await uploadProductImageOnCloudinary(localFilePath);
            if (!uploadedImage) {
                throw new ApiError(400, "Failed to upload one or more product images");
            }
        
            uploadedImages.push(uploadedImage.url); 
        }
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { 
            $set:{
                name,
                price,
                description,
                quantity,
                productImages: uploadedImages,
                category: categoryDoc._id,
            } 
        },
        { new: true }
    ).populate('category')
     .populate('owner', 'name email');

    return res.status(201).json(
        new ApiResponse(200, updatedProduct, "Product Created Successfully")
    )
})



const getAllProductFromSameCategory = asyncHandler(async (req, res) => {
    const category = req.params.category;
    const products = await Product.aggregate(
        [
            {
                $match: {
                    category: category
                }
            }
        ]
    )
    return res.status(200).json(
        new ApiResponse(200, products, "Products Retrieved Successfully")
    )
})

const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().populate('category', 'name')
    return res.status(200).json(
        new ApiResponse(200, products, "Products Retrieved Successfully")
    )
})

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;
  
    const product = await Product.findById(productId)
      .populate('category', 'name')
      .populate('owner', 'name email _id');
  
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
  
    return res.status(200).json(
      new ApiResponse(200, product, "Product retrieved successfully")
    );
});
  

export { addProduct, getAllProductFromSameCategory, getProductById, getAllProducts, updateProduct};
