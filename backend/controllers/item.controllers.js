import uploadOnCloudinary from "../utils/cloudinary.js"
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js"
import { createItemSchema } from "../utils/validators.js";
import logger from "../utils/logger.js";


// ---------- Add Item ----------
export const addItem = async (req, res) => {
    try {
        const validation = createItemSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMsg = validation.error.issues?.[0]?.message || "Invalid Input Data";
            logger.warn(`Add Item Validation Failed: ${errorMsg}`);
            return res.status(400).json({ message: errorMsg });
        }

        const { name, category, foodType, price } = req.body

        // upload image on cloudinary and get url string
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        const shop = await Shop.findOne({ owner: req.userId })
        if (!shop) {
            logger.warn(`Add Item Failed: No shop found for user ${req.userId}`);
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
        logger.info(`Item Added Successfully: ${name} to ${shop.name}`);
        return res.status(201).json(shop)

    } catch (error) {
        logger.error(`Add Item Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Edit Item ----------
export const editItem = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const validation = createItemSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMsg = validation.error.issues?.[0]?.message || "Invalid Input Data";
            logger.warn(`Edit Item Validation Failed: ${errorMsg}`);
            return res.status(400).json({ message: errorMsg });
        }

        const { name, category, foodType, price } = req.body

        // Check ownership
        const itemToCheck = await Item.findById(itemId).populate("shop");
        if (!itemToCheck) {
            return res.status(404).json({ message: "Item not found" });
        }

        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop || itemToCheck.shop._id.toString() !== shop._id.toString()) {
            logger.warn(`Edit Item Unauthorized: User ${req.userId} tried to edit item ${itemId}`);
            return res.status(403).json({ message: "Unauthorized: You do not own this item" });
        }

        // if image also update then upload image on cloudinary and get url string
        let image;
        if (req.file) {
            image = await uploadOnCloudinary(req.file.path)
        }

        const updateData = { name, category, foodType, price };
        if (image) updateData.image = image;

        const item = await Item.findByIdAndUpdate(itemId, updateData, { new: true })

        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })
        logger.info(`Item Edited Successfully: ${itemId} in ${shop.name}`);
        return res.status(200).json(shop)

    } catch (error) {
        logger.error(`Edit Item Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Get Item by Id ----------
export const getItemById = async (req, res) => {
    try {
        const itemId = req.params.itemId
        const item = await Item.findById(itemId)
        if (!item) {
            logger.warn(`Get Item Failed: Item ${itemId} not found`);
            return res.status(404).json({ message: "Item not found" })
        }

        return res.status(200).json(item)

    } catch (error) {
        logger.error(`Get Item Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Delete Item ----------
export const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId

        // Ownership Check
        const itemToCheck = await Item.findById(itemId);
        if (!itemToCheck) return res.status(404).json({ message: "Item not found" });

        const shop = await Shop.findOne({ owner: req.userId });
        if (!shop || itemToCheck.shop.toString() !== shop._id.toString()) {
            return res.status(403).json({ message: "Unauthorized: You do not own this item" });
        }

        const item = await Item.findByIdAndDelete(itemId)

        // Also delete from shop
        shop.items = shop.items.filter(i => i.toString() !== item._id.toString())
        await shop.save()
        await shop.populate({
            path: "items",
            options: { sort: { updatedAt: -1 } }
        })

        logger.info(`Item Deleted Successfully: ${itemId} from ${shop.name}`);
        return res.status(200).json(shop)
    } catch (error) {
        logger.error(`Delete Item Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Get Items By city ----------
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
            logger.info(`Get Items By City: No shops found in ${city}`);
            return res.status(400).json({ message: "Shops not found" })
        }

        // Extract the IDs of all shops related to the selected city and then find all items related to that shopIds
        const shopIds = shops.map((shop) => shop._id)
        const items = await Item.find({ shop: { $in: shopIds } })

        logger.info(`Get Items By City: Found ${items.length} items in ${city}`);
        return res.status(200).json(items)

    } catch (error) {
        logger.error(`Get Items By City Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Get Items By Shop ----------
export const getItemsByShop = async (req, res) => {
    try {
        const { shopId } = req.params

        const shop = await Shop.findById(shopId).populate("items")
        if (!shop) {
            logger.warn(`Get Items By Shop Failed: Shop ${shopId} not found`);
            return res.status(400).json({ message: "Shop not found" })
        }

        logger.info(`Get Items By Shop: Retrieved ${shop.items.length} items for ${shop.name}`);
        return res.status(200).json({
            shop, items: shop.items
        })

    } catch (error) {
        logger.error(`Get Items By Shop Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Search Items ----------
export const searchItems = async (req, res) => {
    try {
        const { query, city } = req.query

        if (!query || !city) {
            logger.warn(`Search Items Failed: Query and City are required`);
            return res.status(400).json({ message: "Query and City are required" })
        }

        const shops = await Shop.find({
            city: { $regex: new RegExp(`^${city}$`, "i") }
        }).populate("items")

        if (shops.length === 0) {
            logger.info(`Search Items: No shops found in ${city}`);
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

        logger.info(`Search Items: Found ${items.length} items for query '${query}' in ${city}`);
        return res.status(200).json(items)

    } catch (error) {
        logger.error(`Search Items Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Item Rating ----------
export const rating = async (req, res) => {
    try {
        const { itemId, rating } = req.body

        if (!itemId || !rating) {
            logger.warn(`Item Rating Failed: ItemId and Rating are required`);
            return res.status(400).json({ message: "ItemId and Rating is Required" })
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 to 5" })
        }

        const item = await Item.findById(itemId)
        if (!item) {
            logger.warn(`Item Rating Failed: Item ${itemId} not found`);
            return res.status(400).json({ message: "Item not found" })
        }

        const newUserCount = item.rating.userCount + 1
        const newAverage = (item.rating.average * item.rating.userCount + rating) / newUserCount

        item.rating.userCount = newUserCount
        item.rating.average = newAverage
        await item.save()

        logger.info(`Item Rating Updated: ${itemId} - New Average: ${newAverage}`);
        return res.status(200).json({ rating: item.rating })

    } catch (error) {
        logger.error(`Item Rating Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}