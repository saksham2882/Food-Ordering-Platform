import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"

export const placeOrder = async (req, res) => {
    try {
        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body

        if (cartItems.length == 0 || !cartItems) {
            return res.status(400).json({ message: "Cart is empty" })
        }
        if (!deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude) {
            return res.status(400).json({ message: "Send complete delivery address" })
        }

        // We want to organize cart items based on shopId.
        // Example: { shopId1: [item1, item2], shopId2: [item3, item4] }
        const groupItemsByShop = {}

        // Loop through all cart items
        // If a shopId is not already in groupItemsByShop, create a new array for it, Then push the item into that shopId's array
        cartItems.forEach(item => {
            const shopId = item.shop

            if (!groupItemsByShop[shopId]) {
                groupItemsByShop[shopId] = []
            }
            groupItemsByShop[shopId].push(item)
        })

        // Create Separate Order for each shop
        const shopOrders = await Promise.all(Object.keys(groupItemsByShop).map(async (shopId) => {

            const shop = await Shop.findById(shopId).populate("owner")
            if (!shop) {
                return res.status(400).json({ message: "Shop not found" })
            }

            // ordered items from shop
            const items = groupItemsByShop[shopId]
            const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0)

            return {
                shop: shop._id,
                owner: shop.owner._id,
                subtotal,
                shopOrderItems: items.map((i) => ({
                    item: i._id,
                    price: i.price,
                    quantity: i.quantity,
                    name: i.name
                }))
            }
        }))

        // create new order
        const newOrder = await Order.create({
            user: req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders
        })

        return res.status(201).json({ message: "Order Placed Successfully", newOrder })

    } catch (error) {
        res.status(500).json({ message: `Something went wrong while placing order: ${error}` });
    }
}