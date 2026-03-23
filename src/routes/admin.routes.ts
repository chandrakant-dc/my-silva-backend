import { Router } from "express";
import { checkToken, loginAdmin, logoutAdmin, registerAdmin, verifyAdmin2FA, verifyOtp } from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createAdminSchema } from "../schemas/admin.schema";

const router = Router();

router.post("/register", validate(createAdminSchema), registerAdmin);
router.post("/login", validate(createAdminSchema), loginAdmin);
router.post("/verify-otp", verifyOtp);
router.post("/verify-2fa", verifyAdmin2FA);
router.post("/logout", authMiddleware, logoutAdmin);
router.get("/check-token", authMiddleware, checkToken);


export default router;