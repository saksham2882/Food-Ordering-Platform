import uploadOnCloudinary from "../utils/cloudinary.js"
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js"


// Add Item
export const addItem = async (req, res) => {
    try {
        const { name, category, foodType, price } = req.body
        if (!name || !category || !foodType || !price) {
            return res.status(400).json({ message: "Please provide all fields" })
        }

        // upload image on cloudinary and get url string
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            return res.status(400).json({ message: "Shop not found" })
        }

        const item = await Item.create({
            name, category, foodType, price, image, shop: shop._id
        })

        // Add the created item to the shop, save the shop, and then populate its items
        shop.items.push(item._id)
        await shop.save()
        await shop.populate("items owner")

        // Sending the shop is useful because when we update myShopData on the frontend, the food items will also update automatically along with it.
        return res.status(201).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `Add item error: ${error}` })
    }
}


// Edit Item
export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const { name, category, foodType, price } = req.body

        // if image also update then upload image on cloudinary and get url string
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        const item = await Item.findByIdAndUpdate(itemId, {
            name, category, foodType, price, image
        }, { new: true })

        if(!item){
            return res.status(400).json({ message: "Item not found" })
        }

    } catch (error) {
        return res.status(500).json({ message: `Edit item error: ${error}` })
    }
}