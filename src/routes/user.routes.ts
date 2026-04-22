import { Router } from "express";
import { forgotPassword, getUserDetails, getUsers, loginUser, logoutUser, registerUser, resetPassword, verifyUserOTP } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createUserSchema, loginUserSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/", validate(createUserSchema), registerUser);
router.post("/login", validate(loginUserSchema), loginUser);
router.get("/", getUsers);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyUserOTP);
router.get("/details", authMiddleware, getUserDetails);
router.post("/logout", authMiddleware, logoutUser);
router.post("/reset-password", authMiddleware, resetPassword);

export default router;