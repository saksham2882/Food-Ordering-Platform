import jwt from "jsonwebtoken"
import logger from "./logger.js";

const genToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
        return token
    } catch (error) {
        logger.error(`Token generation failed: ${error.message}`)
        return null
    }
}

export default genToken