import { Router } from "express";
import { uploadCategoryImage } from "../config/uploadCategoryImage.js";
import { createSubCategory, deleteSubCategory, getAllSubCategory, getOneSubCateDetailsById, getSubCategoryByCategoryId, updateSubCategory } from "../controllers/subcategory.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, uploadCategoryImage.single("image"), createSubCategory);
router.put("/", authMiddleware, uploadCategoryImage.single("image"), updateSubCategory);
router.delete("/:id", authMiddleware, deleteSubCategory);
router.get("/", authMiddleware, getAllSubCategory);
router.get("/all", getSubCategoryByCategoryId);
router.get("/details/:subCategoryId", getOneSubCateDetailsById);

export default router;