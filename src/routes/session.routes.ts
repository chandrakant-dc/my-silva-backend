import { Router } from "express";
import { trackTime } from "../controllers/session.controller.js";

const router = Router();

router.post("/track", trackTime);

export default router;