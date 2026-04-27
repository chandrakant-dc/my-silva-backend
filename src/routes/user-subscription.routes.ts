import { Router } from "express";
import { uploadReceiptImage } from "../config/uploadReceiptImage.js";
import { approveSubscription, createUserSubscription, getAllUserSubscriptions, getUserSubscriptionDetails } from "../controllers/user-subscription.controller.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", authMiddleware, uploadReceiptImage.single("receipt"), createUserSubscription);
router.patch(
    "/subscription/approve/:subscriptionId",
    authMiddleware,
    approveSubscription
);
router.get("/details", authMiddleware, getUserSubscriptionDetails);
router.get("/list", authMiddleware, getAllUserSubscriptions);
export default router;