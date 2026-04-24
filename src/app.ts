import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import "./env-config.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subcategoryRoutes from "./routes/subcategory.routes.js";
import topicRoutes from "./routes/topic.routes.js";

import { fileURLToPath } from "url";
import planRoutes from "./routes/plan.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import userSubscriptionRoutes from "./routes/user-subscription.routes.js";
import userRoutes from "./routes/user.routes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subcategory", subcategoryRoutes);
app.use("/api/v1/topic", topicRoutes);
app.use("/api/v1/plan", planRoutes);
app.use("/api/v1/user-subscription", userSubscriptionRoutes);

app.use("/api/session", sessionRoutes);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
export default app;