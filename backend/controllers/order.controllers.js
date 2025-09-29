import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"
import DeliveryAssignment from "../models/deliveryAssignment.model.js"


// Place Order
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
                    item: i.id,
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
        await newOrder.populate("shopOrders.shopOrderItems.item", "name image price")
        await newOrder.populate("shopOrders.shop", "name")

        return res.status(201).json({ message: "Order Placed Successfully", newOrder })

    } catch (error) {
        return res.status(500).json({ message: `Something went wrong while placing order: ${error}` });
    }
}


// Get My Orders (for both user and owner)
export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        // If logged-in user is a normal user -> fetch all his own orders
        if (user.role == "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price")

            return res.status(200).json(orders)
        }

        // If logged-in user is an owner -> fetch all orders that belong to his shops
        else if (user.role == "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user")
                .populate("shopOrders.shopOrderItems.item", "name image price")

            // Keep only that part of the order which belongs to this owner’s shop(s)
            const filteredOrders = orders.map((order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress
            })))

            return res.status(200).json(filteredOrders)
        }

    } catch (error) {
        return res.status(500).json({ message: `Get My Order Error: ${error}` })
    }
}


// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body

        const order = await Order.findById(orderId)

        // Find the specific shop order inside the order
        const shopOrder = order.shopOrders.find(o => o.shop == shopId)
        if (!shopOrder) {
            return res.status(400).json({ message: "Shop order not found" })
        }

        // Update shop order status
        shopOrder.status = status
        let deliveryBoysPayload = []

        // If No delivery boy is assigned yet OR Status is updated to "Out for Delivery" Then -> Create a new delivery assignment and broadcast it to all free delivery boys within 5km radius
        if (status == "Out for Delivery" || !shopOrder.assignment) {
            const { latitude, longitude } = order.deliveryAddress

            // Find nearby delivery boys within 5km using geolocation
            const nearByDeliveryBoys = await User.find({
                role: "deliveryBoy",
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [Number(longitude), Number(latitude)],
                            $maxDistance: 5000    // 5km radius
                        }
                    }
                }
            })

            // Get IDs of nearby delivery boys
            const nearByIds = nearByDeliveryBoys.map(b => b._id)

            // Find IDs of busy delivery boys (who already have assignments not completed/broadcasted)
            const busyIds = await DeliveryAssignment.find({
                assignedTo: { $in: nearByIds },
                status: { $nin: ["BroadCasted", "Completed"] }
            }).distinct("assignedTo")

            const busyIdSet = new Set(busyIds.map(id => String(id)))

            // Filter out only available delivery boys
            const availableBoys = nearByDeliveryBoys.filter(b => !busyIdSet.has(String(b._id)))
            const candidates = availableBoys.map(b => b._id)

            // If no delivery boys are available
            if(candidates.length == 0){
                await order.save()
                return res.json({
                    message: "Order status updated but no available delivery boys found."
                })
            }

            // Create a new delivery assignment for this shop order
            const deliveryAssignment = await DeliveryAssignment.create({
                order: order._id,
                shop: shopOrder.shop,
                shopOrderId: shopOrder._id,
                broadcastedTo: candidates,
                status: "BroadCasted"
            })

            // Save assignment reference in shopOrder
            shopOrder.assignedDeliveryBoy = deliveryAssignment.assignedTo
            shopOrder.assignment = deliveryAssignment._id

            // Prepare payload of available delivery boys for response
            deliveryBoysPayload = availableBoys.map(b => ({
                id: b._id,
                fullName: b.fullName,
                longitude: b.location.coordinates?.[0],
                latitude: b.location.coordinates?.[1],
                mobile: b.mobile
            }))
        }

        // Save updated shopOrder and order
        await shopOrder.save()
        await order.save()

        // Get updated shop order after saving
        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)

        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment: updatedShopOrder?.assignment._id
        })

    } catch (error) {
        return res.status(500).json({ message: `Order status error: ${error}` })
    }
}