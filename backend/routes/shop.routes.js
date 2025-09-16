import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createOrEditShop } from "../controllers/shop.controllers.js";
import { upload } from "../middlewares/multer.js"

const shopRouter = express.Router()

shopRouter.post("/create-edit", isAuth, upload.single("image"), createOrEditShop)

export default shopRouter