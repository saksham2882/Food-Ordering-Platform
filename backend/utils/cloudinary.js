import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
import dotenv from "dotenv"
import logger from "./logger.js";
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadOnCloudinary = async (file) => {
    try {
        if (!file) return null;

        const res = await cloudinary.uploader.upload(file, {
            resource_type: "auto"
        })

        // delete file from public folder after successful upload
        if (fs.existsSync(file)) {
            fs.unlinkSync(file)
        }

        return res.secure_url;         // return image URL

    } catch (error) {
        // delete file from public folder if upload failed
        if (fs.existsSync(file)) {
            fs.unlinkSync(file)
        }
        logger.error(`Error in Uploading file to Cloudinary: ${error.message}`)
        return null;
    }
}

export default uploadOnCloudinary