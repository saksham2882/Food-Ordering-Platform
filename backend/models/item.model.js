import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    },
    category: {
        type: String,
        enum: [
            "Snacks",
            "Pizza",
            "Burgers",
            "Sandwiches",
            "Rolls",
            "Biryani",
            "North Indian",
            "South Indian",
            "Chinese",
            "Momos",
            "Pasta",
            "Salads",
            "Desserts",
            "Ice Cream",
            "Cakes",
            "Beverages",
            "Tea & Coffee",
            "Juices",
            "Shakes",
            "Chicken",
            "Vegan",
            "Pure Veg",
            "Street Food",
            "Healthy Food",
            "Breakfast",
            "Combo Meals",
            "Other"
        ],
        required: true
    },
    price: {
        type: Number,
        min: 0,
        required: true
    },
    foodType: {
        type: String,
        enum: ["veg", "non-veg"],
        required: true
    },
    rating: {
        average: { type: Number, default: 0 },
        userCount: { type: Number, default: 0 }
    }
}, { timestamps: true })

itemSchema.index({ shop: 1, category: 1 })
itemSchema.index({ category: 1 })
itemSchema.index({ name: "text" })

const Item = mongoose.model("Item", itemSchema)

export default Item