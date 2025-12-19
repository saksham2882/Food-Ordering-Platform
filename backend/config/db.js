import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        logger.info("DB Connected.")
    } catch (error) {
        logger.error(`DB Connection Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB