import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import { changePasswordSchema } from "../utils/validators.js";

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


// Update User Profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, mobile } = req.body;
        const userId = req.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { fullName, mobile },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        logger.error("Update profile error:", error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
    }
}


// Change Password
export const changePassword = async (req, res) => {
    try {
        const validation = changePasswordSchema.safeParse(req.body);
        if (!validation.success) {
            return res.status(400).json({ message: validation.error.issues[0].message });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        const user = await User.findById(userId).select("+password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if current password matches
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        logger.error("Change password error:", error.message);
        return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
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