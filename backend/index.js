import express from "express";
import dotenv from "dotenv"
dotenv.config()
import connectDB from "./config/db.js";
import logger from "./utils/logger.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import http from "http"
import { Server } from "socket.io";
import { socketHandler } from "./socket.js";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ["POST", "GET"]
    }
})

app.set("io", io)

const port = process.env.PORT || 4000

// middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))


// Security & Logging
app.use(helmet());
app.use(morgan("dev"));


// Rate limiting (100 requests per 10 minutes)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 10 minutes"
});
app.use("/api", limiter);


// Health Check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server started" });
});


// Database connection
await connectDB()

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/shop", shopRouter)
app.use("/api/item", itemRouter)
app.use("/api/order", orderRouter)

socketHandler(io)

server.listen(port, () => {
    logger.info(`Server running on port: ${port}`)
})