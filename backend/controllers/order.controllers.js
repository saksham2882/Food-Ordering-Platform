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
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

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
        if (status == "Out for Delivery" && !shopOrder.assignment) {
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
            if (candidates.length == 0) {
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
            assignment: updatedShopOrder?.assignment?._id
        })

    } catch (error) {
        return res.status(500).json({ message: `Order status error: ${error}` })
    }
}


// get delivery assignment for a delivery boy
export const getDeliveryBoyAssignment = async (req, res) => {

    try {
        // Get current logged-in delivery boy Id
        const deliveryBoyId = req.userId

        // Step 1: Find all delivery assignments where this delivery boy is in broadcastedTo and status is still "broadcasted" (means open assignments for him)
        const assignments = await DeliveryAssignment.find({
            broadcastedTo: deliveryBoyId,
            status: "BroadCasted"
        })
            .sort({ createdAt: -1 })
            .populate("order")
            .populate("shop")

        // Format the data so delivery boy gets only the required info
        const formattedData = assignments.map(a => ({
            assignmentId: a._id,
            orderId: a.order._id,
            shopName: a.shop.name,
            deliveryAddress: a.order.deliveryAddress,

            // find shopOrder that belongs to this assignment & return items
            items: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId)).shopOrderItems || [],
            subtotal: a.order.shopOrders.find(so => so._id.equals(a.shopOrderId))?.subtotal
        }))

        return res.status(200).json(formattedData)

    } catch (error) {
        return res.status(500).json({ message: `Get Delivery Assignment error: ${error}` })
    }
}


// Accept Delivery Assignment:
export const acceptDeliveryAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params

        const assignment = await DeliveryAssignment.findById(assignmentId)
        if (!assignment) {
            return res.status(400).json({ message: "Delivery assignment not found" })
        }

        // Check if assignment is still open for acceptance
        if (assignment.status !== "BroadCasted") {
            return res.status(400).json({ message: "This delivery assignment is no longer available." })
        }

        // Check if this delivery boy is already assigned to another active order
        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["BroadCasted", "Completed"] }
        })

        if (alreadyAssigned) {
            return res.status(400).json({ message: "You are already assigned to another delivery." })
        }

        // Assign this delivery to the current delivery boy
        assignment.assignedTo = req.userId
        assignment.status = "Assigned"
        assignment.acceptedAt = new Date()
        await assignment.save()

        // Find the related order
        const order = await Order.findById(assignment.order)
        if (!order) {
            return res.status(400).json({ message: "Order not found" })
        }

        // Update the specific shop order with assigned delivery boy
        const shopOrder = order.shopOrders.id(assignment.shopOrderId)
        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()

        return res.status(200).json({ message: "Delivery assignment accepted successfully." })

    } catch (error) {
        return res.status(500).json({ message: `Accept Delivery Assignment error: ${error}` })
    }
}


// Get current assigned delivery order
export const getCurrentOrder = async (req, res) => {
    try {
        // Find the delivery assignment where status is "Assigned" for this delivery boy
        const assignment = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: "Assigned"
        })
            .populate("shop", "name")
            .populate("assignedTo", "fullName email mobile location")
            .populate({
                path: "order",
                populate: [{ path: "user", select: "fullName email location mobile" }]
            })

        if (!assignment) {
            return res.status(400).json({ message: "Assignment not found" })
        }

        // If order not linked with assignment
        if (!assignment.order) {
            return res.status(400).json({ message: "Order not found" })
        }

        // Find specific shopOrder inside the order
        const shopOrder = assignment.order.shopOrders.find(so => String(so._id) == String(assignment.shopOrderId))
        if (!shopOrder) {
            return res.status(400).json({ message: "Shop order not found" })
        }

        let deliveryBoyLocation = { lat: null, lon: null }
        if (assignment.assignedTo.location.coordinates.length == 2) {
            deliveryBoyLocation.lat = assignment.assignedTo.location.coordinates[1]
            deliveryBoyLocation.lon = assignment.assignedTo.location.coordinates[0]
        }

        let customerLocation = { lat: null, lon: null }
        if (assignment.order.deliveryAddress) {
            customerLocation.lat = assignment.order.deliveryAddress.latitude
            customerLocation.lon = assignment.order.deliveryAddress.longitude
        }

        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation
        })

    } catch (error) {
        return res.status(500).json({ message: `Get Current Delivery Assignment error: ${error}` })
    }
}