import e from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.router.js";
import imagineRouter from "./routes/imagine.router.js";
import connectDb from "./database/connect.db.js";
dotenv.config();

const app = e();
const server = createServer(app);

// Middlewares
app.use(e.json());
app.use(e.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "https://imagine-app-seven.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/main", imagineRouter);

connectDb();
// Middlewares

export default app;
