import { Router } from "express";
import { getUserTrackedTime, trackTime } from "../controllers/session.controller.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

router.post("/track", optionalAuth, trackTime);
router.get("/track", optionalAuth, getUserTrackedTime);

export default router;