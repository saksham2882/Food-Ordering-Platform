import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, updateUserLocation, updateProfile, changePassword } from "../controllers/user.controllers.js"

const userRouter = express.Router()

userRouter.get("/current", isAuth, getCurrentUser)
userRouter.post("/update-location", isAuth, updateUserLocation)
userRouter.put("/update-profile", isAuth, updateProfile)
userRouter.put("/change-password", isAuth, changePassword)

export default userRouter