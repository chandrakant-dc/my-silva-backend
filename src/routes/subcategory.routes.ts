import { Router } from "express";
import { uploadSubCategoryImage } from "../config/subcategory.multer.js";
import { createSubCategory, deleteSubCategory, getAllSubCategory, getOneSubCateDetailsById, getSubCategoryByCategoryId, updateSubCategory } from "../controllers/subcategory.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, uploadSubCategoryImage.single("image"), createSubCategory);
router.put("/", authMiddleware, uploadSubCategoryImage.single("image"), updateSubCategory);
router.delete("/:id", authMiddleware, deleteSubCategory);
router.get("/", authMiddleware, getAllSubCategory);
router.get("/:categoryId", getSubCategoryByCategoryId);
router.get("/details/:subCategoryId", getOneSubCateDetailsById);

export default router;