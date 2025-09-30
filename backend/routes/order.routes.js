import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { acceptDeliveryAssignment, getCurrentOrder, getDeliveryBoyAssignment, getMyOrders, getOrderById, placeOrder, sendDeliveryOTP, updateOrderStatus, verifyDeliveryOTP } from "../controllers/order.controllers.js";

const orderRouter = express.Router()

orderRouter.post("/place-order", isAuth, placeOrder)
orderRouter.get("/my-orders", isAuth, getMyOrders)
orderRouter.get("/get-assignments", isAuth, getDeliveryBoyAssignment)
orderRouter.get("/get-current-order", isAuth, getCurrentOrder)
orderRouter.post("/send-delivery-otp", isAuth, sendDeliveryOTP)
orderRouter.post("/verify-delivery-otp", isAuth, verifyDeliveryOTP)
orderRouter.post("/update-status/:orderId/:shopId", isAuth, updateOrderStatus)
orderRouter.get("/accept-order/:assignmentId", isAuth, acceptDeliveryAssignment)
orderRouter.get("/get-order-by-id/:orderId", isAuth, getOrderById)

export default orderRouter 