import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subcategoryRoutes from "./routes/subcategory.routes.js";
import topicRoutes from "./routes/topic.routes.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://vikas-circle-admin01.netlify.app",
    "https://vikas-circle-web.netlify.app"
]

const app = express();
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subcategory", subcategoryRoutes);
app.use("/api/v1/topic", topicRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
export default app;