import dotenv from "dotenv";
import express from "express";
import adminRoutes from "./routes/admin.routes";
import categoryRoutes from "./routes/category.routes";
dotenv.config();

const app = express();
app.use(express.json());
// app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/category", categoryRoutes)

export default app;