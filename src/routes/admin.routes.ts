import { Router } from "express";
import { loginAdmin, registerAdmin, verifyAdmin2FA, verifyOtp } from "../controllers/admin.controller";
import { validate } from "../middleware/validate";
import { createAdminSchema } from "../schemas/admin.schema";

const router = Router();

router.post("/register", validate(createAdminSchema), registerAdmin);
router.post("/login", validate(createAdminSchema), loginAdmin);
router.post("/verify-otp", verifyOtp);
router.post("/verify-2fa", verifyAdmin2FA)


export default router;