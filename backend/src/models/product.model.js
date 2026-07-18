import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            index: true
        },

        price: {
            type: Number,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        productImages: [
            {
                type: String, //cloudinary URL
                required: true,
            }
        ],

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        productStatus:{
            type:String,
            enum:["Available","Ordered","Sold"],
            default:"Available"
        }
    },
    {
        timestamps: true
    }
);

productSchema.plugin(mongooseAggregatePaginate)

export const Product = mongoose.model("Product", productSchema);