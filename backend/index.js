import express from "express";
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"

const app = express();
const port = process.env.PORT || 4000

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// Database connection
connectDB()

// routes
app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`)
}) 