import mongoose from "mongoose"


// ---------------- Order Schema -----------------
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    paymentMethod: {
        type: String,
        enum: ["COD", "Online"],
        required: true
    },
    deliveryAddress: {
        text: String,
        latitude: Number,
        longitude: Number
    },
    totalAmount: {
        type: Number
    },
    shopOrder: [shopOrderSchema]

}, { timestamps: true })


//  ---------------- Shop Order Schema --------------
const shopOrderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTotal: Number,
    shopOrderItems: [shopOrderItemSchema]

}, { timestamps: true })


// --------------- Shop Order Items Schema ---------------
const shopOrderItemSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    },
    price: Number,
    quantity: Number

}, { timestamps: true })


const Order = mongoose.model("Order", orderSchema)
export default Order