import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js"
import { addItem, deleteItem, editItem, getItemById, getItemsByCity, getItemsByShop, rating, searchItems } from "../controllers/item.controllers.js";

const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem)
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem)
itemRouter.get("/get-by-id/:itemId", getItemById)
itemRouter.delete("/delete/:itemId", isAuth, deleteItem)
itemRouter.get("/get-by-city/:city", getItemsByCity)
itemRouter.get("/get-by-shop/:shopId", getItemsByShop)
itemRouter.get("/search-items", searchItems)
itemRouter.post("/rating", isAuth, rating)

export default itemRouter