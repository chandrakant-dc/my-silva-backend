import { Router } from "express";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createCategory);
router.put("/", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.get("/", getAllCategory);

export default router;