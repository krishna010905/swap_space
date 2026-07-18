import { Category } from "../models/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const createOrGetCategory = asyncHandler(async (categoryName) => {
    const formattedName = categoryName
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');

    let category = await Category.findOne({ name: formattedName });

    if (!category) {
        category = await Category.create({ name: formattedName });
    }

    return category;
});


const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await Category.aggregate([
        {
            $lookup: {
                from: "products", 
                localField: "_id",
                foreignField: "category",
                as: "products"
            }
        },
        {
            $addFields: {
                productCount: { $size: "$products" }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                productCount: 1
            }
        },
        {
            $sort: { productCount: -1 } 
        }
    ]);

    return res.status(200).json(
        new ApiResponse(200, categories, "Categories retrieved successfully")
    );
});


export { getAllCategories, createOrGetCategory };