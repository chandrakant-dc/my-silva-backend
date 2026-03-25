import { Router } from "express";
import { uploadSubCategoryImage } from "../config/subcategory.multer";
import { createSubCategory, deleteSubCategory, getAllSubCategory, getSubCategoryByCategoryId, updateSubCategory } from "../controllers/subcategory.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, uploadSubCategoryImage.single("image"), createSubCategory);
router.put("/", authMiddleware, uploadSubCategoryImage.single("image"), updateSubCategory);
router.delete("/:id", authMiddleware, deleteSubCategory);
router.get("/", authMiddleware, getAllSubCategory);
router.get("/:categoryId", authMiddleware, getSubCategoryByCategoryId);

export default router;