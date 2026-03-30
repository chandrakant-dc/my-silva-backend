import { Router } from "express";
import { uploadCategoryImage } from "../config/category.multer";
import { createCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, uploadCategoryImage.single("image"), createCategory);
router.put("/", authMiddleware, uploadCategoryImage.single("image"), updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);
router.get("/", getAllCategory);

export default router;