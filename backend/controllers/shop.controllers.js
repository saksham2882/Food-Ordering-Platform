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

        await shop.populate("owner")
        return res.status(201).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `Create shop error: ${error}` })
    }
}


