import { Router } from "express";
import { uploadCategoryImage } from "../config/category.multer.js";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, uploadCategoryImage.single("image"), createCategory);
router.put("/", authMiddleware, uploadCategoryImage.single("image"), updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.get("/", getAllCategory);

export default router;