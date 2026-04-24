import { Router } from "express";
import { createPlan, getAllPlan } from "../controllers/plan.controller.js";
// import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", createPlan);
router.get("/", getAllPlan);
export default router;