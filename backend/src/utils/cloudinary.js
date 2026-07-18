import {v2 as cloudinary} from "cloudinary"
import fs from "fs" 

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadProductImageOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "swapspace/productimage",
        })
        console.log("File is uploaded on Cloudinary ", response.url);
        // fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const uploadProfileImageOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            console.log('No file path provided');
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "swapspace/profileImage",
        })
        console.log("File is uploaded on Cloudinary ", response.url);
        // fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

const uploadProductVideoOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "swapspace/productimage",
        })
        console.log("File is uploaded on Cloudinary ", response.url);
        // fs.unlinkSync(localFilePath)
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {
    uploadProductImageOnCloudinary, 
    uploadProductVideoOnCloudinary,
    uploadProfileImageOnCloudinary
}
