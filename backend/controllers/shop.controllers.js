import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";


// Create Or Edit Shop
export const createOrEditShop = async (req, res) => {
    try {
        const { name, city, state, address } = req.body;

        if (!name || !city || !state || !address) {
            return res.status(400).json({ message: "" })
        }
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        let shop = await Shop.findOne({ owner: req.userId })

        // Create Shop
        if (!shop) {
            shop = await Shop.create({
                name, city, state, address, image, owner: req.userId
            })
        }
        // Edit shop
        else {
            shop = await Shop.findByIdAndUpdate(shop._id, {
                name, city, state, address, image, owner: req.userId
            }, { new: true })
        }

        await shop.populate("owner items")
        return res.status(201).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `Create shop error: ${error}` })
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
            return null
        }
        return res.status(200).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `Get my shop error: ${error}` })
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

        if (!shops) {
            return res.status(400).json({ message: "Shop not found" })
        }

        return res.status(200).json(shops)
        
    } catch (error) {
        return res.status(500).json({ message: `Get my shop error: ${error}` })
    }
}