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
        await shop.populate("owner")
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })

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

        if (!item) {
            return res.status(400).json({ message: "Item not found" })
        }

        const shop = await Shop.findOne({ owner: req.userId }).populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        return res.status(200).json(shop)

    } catch (error) {
        return res.status(500).json({ message: `Edit item error: ${error}` })
    }
}


// Get Item by Id
export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)
        if (!item) {
            return res.status(400).json({ message: "Item not found" })
        }

        return res.status(200).json(item)

    } catch (error) {
        return res.status(500).json({ message: `Edit item error: ${error}` })
    }
}


// Delete Item
export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findByIdAndDelete(itemId)
        if (!item) {
            return res.status(400).json({ message: "Item not found" })
        }

        // Also delete from shop
        const shop = await Shop.findOne({ owner: req.userId })
        shop.items = shop.items.filter(i => i !== item._id)
        await shop.save()
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })

        return res.status(200).json(shop)
    } catch (error) {
        return res.status(500).json({ message: `Delete item error: ${error}` })
    }
}


// Get Items By city
export const getItemsByCity = async (req, res) => {
    try {
        const { city } = req.params
        if (!city) {
            return res.status(400).json({ message: "City is required" })
        }

        // Find all shops that match the given city name (case-insensitive)
        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate('items')

        if (shops.length === 0) {
            return res.status(400).json({ message: "Shops not found" })
        }

        // Extract the IDs of all shops related to the selected city and then find all items related to that shopIds
        const shopIds = shops.map((shop) => shop._id)
        const items = await Item.find({ shop: { $in: shopIds } })

        return res.status(200).json(items)

    } catch (error) {
        return res.status(500).json({ message: `Get item by city error: ${error}` })
    }
}


// Get Items By Shop
export const getItemsByShop = async (req, res) => {
    try {
        const { shopId } = req.params

        const shop = await Shop.findById(shopId).populate("items")
        if (!shop) {
            return res.status(400).json({ message: "Shop not found" })
        }

        return res.status(200).json({
            shop, items: shop.items
        })

    } catch (error) {
        return res.status(500).json({ message: `Get items by shop error: ${error}` })
    }
}


// Search Items
export const searchItems = async (req, res) => {
    try {
        const { query, city } = req.query

        if (!query || !city) {
            return null
        }

        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate("items")

        if (!shops) {
            return res.status(400).json({ message: "Shop not found" })
        }

        const shopIds = shops.map(s => s._id)
        const items = await Item.find({
            shop: { $in: shopIds },
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ]
        }).populate("shop", "name image")

        return res.status(200).json(items)

    } catch (error) {
        return res.status(500).json({ message: `Search Items error: ${error}` })
    }
}