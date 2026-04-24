import { Router } from "express";
import { uploadCategoryImage } from "../config/uploadCategoryImage.js";
import { createSubCategory, deleteSubCategory, getAllSubCategory, getOneSubCateDetailsById, getSubCategoryByCategoryId, getUserProgressSubcategories, updateSubCategory } from "../controllers/subcategory.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

router.post("/", authMiddleware, uploadCategoryImage.single("image"), createSubCategory);
router.put("/", authMiddleware, uploadCategoryImage.single("image"), updateSubCategory);
router.delete("/:id", authMiddleware, deleteSubCategory);
router.get("/", authMiddleware, getAllSubCategory);
router.get("/all", optionalAuth, getSubCategoryByCategoryId);
router.get("/details/:subCategoryId", optionalAuth, getOneSubCateDetailsById);
router.get("/active-courses", authMiddleware, getUserProgressSubcategories);

export default router;