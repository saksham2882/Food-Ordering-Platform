import jwt from "jsonwebtoken"
import logger from "../utils/logger.js";

const isAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // decode token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get and store user id
        req.userId = decoded.userId
        next()

    } catch (error) {
        logger.error("Auth Middleware Error:", error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}

export default isAuth