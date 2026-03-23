import { Router } from "express";
import { loginAdmin, registerAdmin, verifyOtp } from "../controllers/admin.controller";
import { validate } from "../middleware/validate";
import { createAdminSchema } from "../schemas/admin.schema";

const router = Router();

router.post("/register", validate(createAdminSchema), registerAdmin);
router.post("/login", validate(createAdminSchema), loginAdmin);
router.post("/verify-otp", verifyOtp);


export default router;