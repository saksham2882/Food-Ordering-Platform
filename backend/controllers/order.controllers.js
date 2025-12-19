import dotenv from "dotenv"
dotenv.config()
import Order from "../models/order.model.js"
import Shop from "../models/shop.model.js"
import User from "../models/user.model.js"
import DeliveryAssignment from "../models/deliveryAssignment.model.js"
import { sendDeliveryOTPMail } from "../utils/mail.js"
import { placeOrderSchema } from "../utils/validators.js";
import { randomInt } from 'crypto'
import logger from "../utils/logger.js";
import RazorPay from "razorpay"
import mongoose from "mongoose"


// ---------- RazorPay Instance ----------
let instance = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


// ---------- Place Order ----------
export const placeOrder = async (req, res) => {
    try {
        const validation = placeOrderSchema.safeParse(req.body);

        if (!validation.success) {
            const errorMsg = validation.error.issues?.[0]?.message || "Invalid Input Data";
            logger.warn(`Place Order Validation Failed: ${errorMsg}`);
            return res.status(400).json({ message: errorMsg });
        }

        const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body

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
                // If one shop is missing, this entire order process might fail or need handling.
                // For simplicity, we might throw here to be caught by catch block
                throw new Error("Shop not found");
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

        // Payment through Online
        if (paymentMethod == "Online") {
            const razorOrder = await instance.orders.create({
                amount: Math.round(totalAmount * 100),         // in paisa
                currency: "INR",
                receipt: `receipt_${Date.now()}`
            })

            const newOrder = await Order.create({
                user: req.userId,
                paymentMethod,
                deliveryAddress,
                totalAmount,
                shopOrders,
                razorpayOrderId: razorOrder.id,
                payment: false
            })

            return res.status(200).json({
                razorOrder,
                orderId: newOrder._id,
            })
        }

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
        await newOrder.populate("shopOrders.owner", "name socketId")
        await newOrder.populate("user", "name email mobile")

        // get socket io from req.app -> where we set io in express app
        const io = req.app.get("io")

        // send real-time order to particular owner for each shop Order
        if (io) {
            newOrder.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner.socketId

                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: newOrder._id,
                        paymentMethod: newOrder.paymentMethod,
                        user: newOrder.user,
                        shopOrders: shopOrder,
                        createdAt: newOrder.createdAt,
                        deliveryAddress: newOrder.deliveryAddress,
                        payment: newOrder.payment
                    })
                }
            })
        }

        logger.info(`Order Placed Successfully: ${newOrder._id} for User ${req.userId}`);
        return res.status(201).json({ message: "Order Placed Successfully", newOrder })

    } catch (error) {
        logger.error(`Place Order Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Verify Online Payment ----------
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, orderId } = req.body

        if (!razorpay_payment_id || !orderId) {
            return res.status(400).json({ message: "Payment ID and Order ID are required" })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Prevent double processing
        if (order.payment) {
            return res.status(400).json({ message: "Order is already paid" })
        }

        // Verify Payment Status from Razorpay
        const payment = await instance.payments.fetch(razorpay_payment_id)
        if (!payment || payment.status !== "captured") {
            return res.status(400).json({ message: "Payment not captured" })
        }

        // Update Order
        order.payment = true
        order.razorpayPaymentId = razorpay_payment_id
        await order.save()

        await order.populate("shopOrders.shopOrderItems.item", "name image price")
        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.owner", "name socketId")
        await order.populate("user", "name email mobile")

        // get socket io from req.app -> where we set io in express app
        const io = req.app.get("io")

        // send real-time order to particular owner for each shop Order when payment verify successfully
        if (io) {
            order.shopOrders.forEach(shopOrder => {
                const ownerSocketId = shopOrder.owner.socketId

                if (ownerSocketId) {
                    io.to(ownerSocketId).emit('newOrder', {
                        _id: order._id,
                        paymentMethod: order.paymentMethod,
                        user: order.user,
                        shopOrders: shopOrder,
                        createdAt: order.createdAt,
                        deliveryAddress: order.deliveryAddress,
                        payment: order.payment
                    })
                }
            })
        }

        logger.info(`Payment Verified Successfully for Order: ${orderId}`);
        return res.status(200).json(order)

    } catch (error) {
        logger.error(`Verify Payment Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}


// ---------- Get My Orders (for both user and owner) ----------
export const getMyOrders = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) return res.status(404).json({ message: "User not found" });

        // If logged-in user is a normal user -> fetch all his own orders
        if (user.role === "user") {
            const orders = await Order.find({ user: req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("shopOrders.owner", "name email mobile")
                .populate("shopOrders.shopOrderItems.item", "name image price")

            return res.status(200).json(orders);
        }

        // If logged-in user is an owner -> fetch all orders that belong to his shops
        if (user.role === "owner") {
            const orders = await Order.find({ "shopOrders.owner": req.userId })
                .sort({ createdAt: -1 })
                .populate("shopOrders.shop", "name")
                .populate("user", "fullName email mobile location")
                .populate("shopOrders.shopOrderItems.item", "name image price")
                .populate("shopOrders.assignedDeliveryBoy", "fullName mobile")

            // Keep only that part of the order which belongs to this owner’s shop(s)
            const filteredOrders = orders.map((order => ({
                _id: order._id,
                paymentMethod: order.paymentMethod,
                user: order.user,
                shopOrders: order.shopOrders.find(o => o.owner._id == req.userId),
                createdAt: order.createdAt,
                deliveryAddress: order.deliveryAddress,
                payment: order.payment
            })))

            return res.status(200).json(filteredOrders);
        }

        // other roles (e.g. deliveryBoy)
        return res.status(403).json({ message: "Access denied" }); 

    } catch (error) {
        logger.error(`Get My Orders Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Update order status ----------
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, shopId } = req.params
        const { status } = req.body

        // Check if the user owns the shop
        const shop = await Shop.findOne({ _id: shopId, owner: req.userId });
        if (!shop) {
            return res.status(403).json({ message: "Unauthorized: You do not own this shop" });
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Find the specific shop order inside the order
        const shopOrder = order.shopOrders.find(o => o.shop == shopId)
        if (!shopOrder) {
            return res.status(404).json({ message: "Shop order not found" })
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
                // Save status update even if no delivery boy found
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

            await deliveryAssignment.populate('order')
            await deliveryAssignment.populate('shop')

            // send real-time new delivery-assignment notification to all available delivery boys
            const io = req.app.get("io")

            if (io) {
                availableBoys.forEach(boy => {
                    const deliveryBoySocketId = boy.socketId

                    if (deliveryBoySocketId) {
                        io.to(deliveryBoySocketId).emit('newAssignment', {
                            sentTo: boy._id,
                            assignmentId: deliveryAssignment._id,
                            orderId: deliveryAssignment.order._id,
                            shopName: deliveryAssignment.shop.name,
                            deliveryAddress: deliveryAssignment.order.deliveryAddress,

                            // find shopOrder that belongs to this assignment & return items
                            items: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId)).shopOrderItems || [],
                            subtotal: deliveryAssignment.order.shopOrders.find(so => so._id.equals(deliveryAssignment.shopOrderId))?.subtotal
                        })
                    }
                })
            }
        }

        // Save updated shopOrder and order
        await shopOrder.save()
        await order.save()

        // Get updated shop order after saving
        const updatedShopOrder = order.shopOrders.find(o => o.shop == shopId)

        await order.populate("shopOrders.shop", "name")
        await order.populate("shopOrders.assignedDeliveryBoy", "fullName email mobile")
        await order.populate("user", "socketId")

        // get socket io from req.app -> where we set io in express app
        const io = req.app.get("io")

        // Send real-time status update to user for particular order from this owner shop
        if (io) {
            const userSocketId = order.user.socketId

            if (userSocketId) {
                io.to(userSocketId).emit('update-status', {
                    orderId: order._id,
                    shopId: updatedShopOrder.shop._id,
                    status: updatedShopOrder.status,
                    userId: order.user._id
                })
            }
        }

        return res.status(200).json({
            shopOrder: updatedShopOrder,
            assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
            availableBoys: deliveryBoysPayload,
            assignment: updatedShopOrder?.assignment?._id
        })

    } catch (error) {
        logger.error(`Update Order Status Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- get delivery assignment for a delivery boy ----------
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
            .populate("shop", "name")

        // Format the data safely, filtering out invalid assignments
        const formattedData = assignments.reduce((acc, a) => {
            if (!a.order || !a.shop) return acc;

            // Find specific shopOrder safely using string comparison for ObjectIds
            const relevantShopOrder = a.order.shopOrders?.find(so => 
                so._id.toString() === a.shopOrderId.toString()
            );

            if (!relevantShopOrder) return acc;

            acc.push({
                assignmentId: a._id,
                orderId: a.order._id,
                shopName: a.shop.name,
                deliveryAddress: a.order.deliveryAddress,
                items: relevantShopOrder.shopOrderItems || [],
                subtotal: relevantShopOrder.subtotal
            });

            return acc;
        }, []);

        return res.status(200).json(formattedData)

    } catch (error) {
        logger.error(`Get Delivery Assignment Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Accept Delivery Assignment ----------
export const acceptDeliveryAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params

        // 1. Check if this delivery boy is already busy (Early exit)
        const alreadyAssigned = await DeliveryAssignment.findOne({
            assignedTo: req.userId,
            status: { $nin: ["BroadCasted", "Completed"] }
        })

        if (alreadyAssigned) {
            return res.status(400).json({ message: "You are already assigned to another delivery." })
        }

        // 2. Try to claim the assignment
        const assignment = await DeliveryAssignment.findOneAndUpdate(
            { _id: assignmentId, status: "BroadCasted" }, 
            {
                $set: {
                    assignedTo: req.userId,
                    status: "Assigned",
                    acceptedAt: new Date()
                }
            },
            { new: true }
        )

        // If null, it means either ID is wrong OR status was not BroadCasted (taken/cancelled)
        if (!assignment) {
            return res.status(400).json({ message: "Assignment not found or already accepted by someone else." })
        }

        // 3. Update the Order
        const order = await Order.findById(assignment.order)
        if (!order) {
            // ROLLBACK: If order is missing, release the assignment
            await DeliveryAssignment.findByIdAndUpdate(assignmentId, {
                $unset: { assignedTo: 1, acceptedAt: 1 },
                $set: { status: "BroadCasted" }
            });
            return res.status(404).json({ message: "Order not found" })
        }

        // 4. Update the ShopOrder
        const shopOrder = order.shopOrders.id(assignment.shopOrderId)
        if (!shopOrder) {
             // ROLLBACK
             await DeliveryAssignment.findByIdAndUpdate(assignmentId, {
                $unset: { assignedTo: 1, acceptedAt: 1 },
                $set: { status: "BroadCasted" }
            });
            return res.status(404).json({ message: "ShopOrder not found within Order" })
        }

        shopOrder.assignedDeliveryBoy = req.userId
        await order.save()

        logger.info(`Delivery Assignment Accepted: ${assignmentId} by ${req.userId}`);
        return res.status(200).json({ message: "Delivery assignment accepted successfully." })

    } catch (error) {
        logger.error(`Accept Delivery Assignment Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Get current assigned delivery order ----------
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
            .lean();

        if (!assignment) {
            return res.status(200).json({ message: "No current assignment" })
        }

        // If order not linked with assignment
        if (!assignment.order) {
            return res.status(404).json({ message: "Order not found" })
        }
        if (!assignment.assignedTo) {
             return res.status(404).json({ message: "Delivery Boy profile not found" })
        }

        // Find specific shopOrder inside the order
        const shopOrder = assignment.order.shopOrders?.find(so => 
            so._id.toString() === assignment.shopOrderId.toString()
        )

        if (!shopOrder) {
            return res.status(404).json({ message: "Shop order not found" })
        }

        const deliveryBoyLocation = {
            lat: assignment.assignedTo.location?.coordinates?.[1] || null,
            lon: assignment.assignedTo.location?.coordinates?.[0] || null
        };

        const customerLocation = {
            lat: assignment.order.deliveryAddress?.latitude || null,
            lon: assignment.order.deliveryAddress?.longitude || null
        };

        return res.status(200).json({
            _id: assignment.order._id,
            user: assignment.order.user,
            shopOrder,
            deliveryAddress: assignment.order.deliveryAddress,
            deliveryBoyLocation,
            customerLocation
        })

    } catch (error) {
        logger.error(`Get Current Delivery Assignment Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Get Order Tracking for User ----------
export const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params

        const order = await Order.findById(orderId)
            .populate("user")
            .populate({
                path: "shopOrders.shop",
                model: "Shop"
            })
            .populate({
                path: "shopOrders.assignedDeliveryBoy",
                model: "User"
            })
            .populate({
                path: "shopOrders.shopOrderItems.item",
                model: "Item"
            })
            .lean()

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Handle if User was deleted
        const orderUserId = order.user?._id?.toString();
        
        // Access Control Logic
        const isUser = orderUserId === req.userId;
        
        // Check if requester is an Owner of any shop in this order
        const isOwner = order.shopOrders?.some(so => so.owner?.toString() === req.userId);
        
        // Check if requester is an Assigned Delivery Boy for any shop in this order
        const isDeliveryBoy = order.shopOrders?.some(so => so.assignedDeliveryBoy?._id?.toString() === req.userId);

        if (!isUser && !isOwner && !isDeliveryBoy) {
            return res.status(403).json({ message: "Unauthorized to view this order" });
        }

        // Privacy Filtering:
        // - User see the full order.
        // - Owners/DeliveryBoys only see the specific shopOrders relevant to them.
        if (!isUser) {
            order.shopOrders = order.shopOrders.filter(so => {
                const belongsToOwner = so.owner?.toString() === req.userId;
                const assignedToBoy = so.assignedDeliveryBoy?._id?.toString() === req.userId;
                return belongsToOwner || assignedToBoy;
            });
        }

        return res.status(200).json(order)

    } catch (error) {
        logger.error(`Order Tracking Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Send Order Delivery Confirmation through otp ----------
export const sendDeliveryOTP = async (req, res) => {
    try {
        const { orderId, shopOrderId } = req.body

        if (!orderId || !shopOrderId) {
            return res.status(400).json({ message: "Order ID and Shop Order ID are required" })
        }

        const order = await Order.findById(orderId).populate("user")
        if (!order) return res.status(404).json({ message: "Order not found" });

        // check for deleted user
        if (!order.user) {
            return res.status(400).json({ message: "Customer account no longer exists. Cannot send OTP." });
        }

        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!shopOrder) return res.status(404).json({ message: "ShopOrder not found" });

        // Check if requester is the assigned delivery boy
        if (shopOrder.assignedDeliveryBoy?.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: only assigned delivery boy can send OTP" });
        }

        // Check if already delivered
        if (shopOrder.status === "Delivered") {
            return res.status(400).json({ message: "Order is already delivered" });
        }

        // Ensure order is in valid state for OTP
        if (!["Out for Delivery", "Assigned"].includes(shopOrder.status)) {
            return res.status(400).json({ message: "Order must be Out for Delivery to generate OTP" });
        }

        // Rate Limiting (1 Minute Cooldown)
        const fiveMinutes = 5 * 60 * 1000;
        const oneMinute = 60 * 1000;
        if (shopOrder.otpExpires && shopOrder.otpExpires > Date.now() + (fiveMinutes - oneMinute)) {
            const remainingTime = Math.ceil((shopOrder.otpExpires - (Date.now() + (fiveMinutes - oneMinute))) / 1000);
            return res.status(429).json({ message: `Please wait ${remainingTime} seconds before resending OTP` });
        }

        const otp = randomInt(100000, 999999).toString();

        shopOrder.deliveryOtp = otp
        shopOrder.otpExpires = Date.now() + fiveMinutes     // expire in 5 minutes

        await order.save()
        
        try {
            await sendDeliveryOTPMail(order.user, otp)
        } catch (mailError) {
            logger.error(`Failed to send OTP email: ${mailError.message}`);
            return res.status(500).json({ message: "OTP generated but email failed to send." });
        }

        logger.info(`Delivery OTP Sent to ${order.user.email} for Order ${orderId}`);
        return res.status(200).json({ message: `OTP sent successfully to ${order.user.fullName || "Customer"}` })

    } catch (error) {
        logger.error(`Send Delivery OTP Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// ---------- Verify Delivery Confirmation OTP ----------
export const verifyDeliveryOTP = async (req, res) => {
    try {
        const { orderId, shopOrderId, otp } = req.body

        if (!orderId || !shopOrderId || !otp) {
            return res.status(400).json({ message: "Order ID, Shop Order ID, and OTP are required" })
        }

        const order = await Order.findById(orderId)
            .populate("user", "socketId fullName email mobile")
            .populate("shopOrders.owner", "socketId")
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        const shopOrder = order.shopOrders.id(shopOrderId)
        if (!shopOrder) return res.status(404).json({ message: "ShopOrder not found" });

        // Check if requester is the assigned delivery boy
        if (shopOrder.assignedDeliveryBoy?.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized: only assigned delivery boy can verify OTP" });
        }

        // Check if already delivered
        if (shopOrder.status === "Delivered") {
             return res.status(400).json({ message: "Order is already delivered" });
        }

        // OTP Validation
        if (!shopOrder.deliveryOtp || !shopOrder.otpExpires) {
            return res.status(400).json({ message: "OTP not generated" });
        }
        if (shopOrder.deliveryOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (shopOrder.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP Expired" });
        }

        // Mark as Delivered and Clean up OTP fields
        shopOrder.status = "Delivered"
        shopOrder.deliveredAt = Date.now()
        shopOrder.deliveryOtp = undefined;
        shopOrder.otpExpires = undefined;

        await order.save()

        // Delete DeliveryAssignment since order is completed
        await DeliveryAssignment.deleteOne({
            shopOrderId: shopOrder._id,
            order: order._id,
            assignedTo: shopOrder.assignedDeliveryBoy
        })

        // Real-time Notifications
        const io = req.app.get("io")
        if (io) {
            // 1. Notify Customer
            if (order.user?.socketId) {
                io.to(order.user.socketId).emit('update-status', {
                    orderId: order._id,
                    shopId: shopOrder.shop,
                    status: "Delivered",
                    userId: order.user._id
                })
            }

            // 2. Notify Shop Owner
            if (shopOrder.owner?.socketId) {
                io.to(shopOrder.owner.socketId).emit('update-status', {
                    orderId: order._id,
                    shopId: shopOrder.shop,
                    status: "Delivered",
                    shopOrderId: shopOrder._id
                })
            }
        }

        logger.info(`Order ${orderId} Marked as Delivered by ${req.userId}`);
        return res.status(200).json({ message: "Order Delivered Successfully" })

    } catch (error) {
        logger.error(`Verify Delivery OTP Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}


// Today Delivery Records for Delivery boy
export const getTodayDeliveries = async (req, res) => {
    try {
        const deliveryBoyId = req.userId

        // Get start of the current day (12:00 AM)
        const startsOfDay = new Date()
        startsOfDay.setHours(0, 0, 0, 0)

        const stats = await Order.aggregate([
            // Match ONLY orders that have at least one relevant shopOrder
            {
                $match: {
                    "shopOrders.assignedDeliveryBoy": new mongoose.Types.ObjectId(deliveryBoyId),
                    "shopOrders.status": "Delivered",
                    "shopOrders.deliveredAt": { $gte: startsOfDay }
                }
            },
            // Unwind shopOrders to process them individually
            { $unwind: "$shopOrders" },
            // Filter the unwound documents to keep only the relevant shopOrders
            {
                $match: {
                    "shopOrders.assignedDeliveryBoy": new mongoose.Types.ObjectId(deliveryBoyId),
                    "shopOrders.status": "Delivered",
                    "shopOrders.deliveredAt": { $gte: startsOfDay }
                }
            },
            // Project the hour
            {
                $project: {
                    hour: { $hour: "$shopOrders.deliveredAt" }
                }
            },
            // Group by hour
            {
                $group: {
                    _id: "$hour",
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ])

        const formattedStats = stats.map(item => ({
            hour: item._id,
            count: item.count
        }))

        return res.status(200).json(formattedStats)

    } catch (error) {
        logger.error(`Get Today Deliveries Error: ${error.message}`);
        return res.status(500).json({ message: error.message || "Internal Server Error" })
    }
}