import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { createShopSchema } from "../utils/validators.js";
import logger from "../utils/logger.js";


// Create Or Edit Shop
export const createOrEditShop = async (req, res) => {
    try {
        const validation = createShopSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMsg = validation.error.issues?.[0]?.message || "Invalid Input Data";
            logger.warn(`Shop Validation Failed: ${errorMsg}`);
            return res.status(400).json({ message: errorMsg });
        }

        const { name, city, state, address } = req.body;

        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        let shop = await Shop.findOne({ owner: req.userId })

        // Create Shop
        if (!shop) {
            if (!image) return res.status(400).json({ message: "Image is required for creating a shop" });

            shop = await Shop.create({
                name, city, state, address, image, owner: req.userId
            })
        }
        // Edit shop
        else {
            const updateData = { name, city, state, address, owner: req.userId };
            if (image) updateData.image = image;

            shop = await Shop.findByIdAndUpdate(shop._id, updateData, { new: true })
        }

        await shop.populate("owner items")
        logger.info(`Shop ${shop.name} ${req.body.name ? "Updated" : "Created"} Successfully`);
        return res.status(201).json(shop)

    } catch (error) {
        logger.error(`Create/Edit Shop Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// Get My Shop
export const getMyShop = async (req, res) => {
    try {
        const shop = await Shop.findOne({ owner: req.userId }).populate("owner").populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        if (!shop) {
            logger.info(`Get My Shop: No shop found for user ${req.userId}`);
            return res.status(200).json(null)
        }
        logger.info(`Get My Shop: Retrieved ${shop.name}`);
        return res.status(200).json(shop)

    } catch (error) {
        logger.error(`Get My Shop Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// Get Shop By city
export const getShopByCity = async (req, res) => {
    try {
        const { city } = req.params

        const shops = await Shop.find({
            // Match city name ignoring case sensitivity (e.g., "Delhi" = "delhi" = "DELHI")
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')

        if (shops.length === 0) {
            logger.info(`Get Shop By City: No shops found in ${city}`);
            return res.status(404).json({ message: "No restaurants found in this city" })
        }

        logger.info(`Get Shop By City: Found ${shops.length} shops in ${city}`);
        return res.status(200).json(shops)

    } catch (error) {
        logger.error(`Get Shop By City Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}