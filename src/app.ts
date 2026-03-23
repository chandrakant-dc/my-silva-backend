import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import adminRoutes from "./routes/admin.routes";
import categoryRoutes from "./routes/category.routes";

dotenv.config();

const app = express();
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/category", categoryRoutes)

export default app;