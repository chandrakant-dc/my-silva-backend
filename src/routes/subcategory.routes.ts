import { Router } from "express";
import { createSubCategory, deleteSubCategory, getAllSubCategory, updateSubCategory } from "../controllers/subcategory.controller";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, createSubCategory);
router.put("/", authMiddleware, updateSubCategory);
router.delete("/:id", authMiddleware, deleteSubCategory);
router.get("/", getAllSubCategory);

export default router;