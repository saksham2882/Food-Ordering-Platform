import User from "../models/user.model.js";
import logger from "../utils/logger.js";

// get current user
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "User ID missing from request" })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json(user)
    } catch (error) {
        logger.error("Get current user error:", error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` })
    }
}


// Update User location
export const updateUserLocation = async (req, res) => {
    try {
        const { lat, lon } = req.body
        
        if (lat === undefined || lat === null || lon === undefined || lon === null) {
            return res.status(400).json({ message: "Latitude and Longitude are required" })
        }

        const user = await User.findByIdAndUpdate(req.userId, {
            location: {
                type: "Point",
                coordinates: [lon, lat]
            }
        }, { new: true })

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "Location Updated Successfully", location: user.location })

    } catch (error) {
        logger.error("Update location error:", error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` })
    }
}