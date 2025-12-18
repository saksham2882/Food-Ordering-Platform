import { z } from "zod";

// User Schemas
export const signUpSchema = z.object({
    fullName: z.string().min(2, "FullName must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    mobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    role: z.enum(["user", "owner", "deliveryBoy"])
});

export const signInSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

export const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
    newPassword: z.string().min(8, "Password must be at least 8 characters")
});


// Shop Schemas
export const createShopSchema = z.object({
    name: z.string().min(2, "Shop name is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    address: z.string().min(5, "Address is required")
});


// Item Schemas
export const createItemSchema = z.object({
    name: z.string().min(2, "Item name is required"),
    category: z.enum([
        "Snacks", "Pizza", "Burgers", "Sandwiches", "Rolls", "Biryani", "North Indian",
        "South Indian", "Chinese", "Momos", "Pasta", "Salads", "Desserts", "Ice Cream",
        "Cakes", "Beverages", "Tea & Coffee", "Juices", "Shakes", "Chicken", "Vegan",
        "Pure Veg", "Street Food", "Healthy Food", "Breakfast", "Combo Meals", "Other"
    ]),
    foodType: z.enum(["veg", "non-veg"]),
    price: z.coerce.number().min(0, "Price must be a positive number")
});


// Order Schemas
export const placeOrderSchema = z.object({
    cartItems: z.array(z.object({
        shop: z.string(),
        price: z.number(),
        quantity: z.number().min(1),
        name: z.string()
    })).min(1, "Cart cannot be empty"),
    paymentMethod: z.enum(["COD", "Online"]),
    deliveryAddress: z.object({
        text: z.string(),
        latitude: z.number(),
        longitude: z.number()
    }),
    totalAmount: z.number().min(0)
});
