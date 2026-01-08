import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createOrEditShop, getMyShop, getShopByCity } from "../controllers/shop.controllers.js";
import { upload } from "../middlewares/multer.js"

const shopRouter = express.Router()

shopRouter.post("/create-edit", isAuth, upload.single("image"), createOrEditShop)
shopRouter.get("/get-my", isAuth, getMyShop)
shopRouter.get("/get-by-city/:city", getShopByCity)

export default shopRouter