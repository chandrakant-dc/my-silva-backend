import type { Request, Response } from "express";
import mongoose from "mongoose";
import { uploadToCloudinary } from "../config/uploadToCloudinary.js";
import Plan from "../models/plan.model.js";
import UserSubscription from "../models/user-subscription.model.js";
import { formatDate } from "../utils/date.format.js";

export const createUserSubscription = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const { planId } = req.body;

        if (!planId || !mongoose.Types.ObjectId.isValid(planId)) {
            return res.status(400).json({
                status: false,
                message: "Valid planId is required"
            });
        }

        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        let receiptUrl = "";

        if (req.file) {
            const result: any = await uploadToCloudinary(
                req.file.buffer,
                "receipts"
            );

            receiptUrl = result.secure_url;
        } else {
            return res.status(400).json({
                status: false,
                message: "Receipt image is required"
            });
        }

        const existing = await UserSubscription.findOne({
            user: userId,
            subscriptionStatus: { $in: ["pending", "activated"] }
        });

        if (existing) {
            return res.status(400).json({
                status: false,
                message: "You already have an active or pending subscription"
            });
        }

        const subscription = await UserSubscription.create({
            user: userId,
            plan: planId,
            receiptUrl,
            subscriptionStatus: "pending"
        });

        return res.status(201).json({
            status: true,
            message: "Submitted successfully, our team will verify your payment & activate your plan within 24 hours.",
            data: subscription
        });
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error,
        });
    }
};

export const approveSubscription = async (req: Request, res: Response) => {
    try {
        const { subscriptionId } = req.params;

        if (!subscriptionId) {
            return res.status(400).json({
                status: false,
                message: "subscription ID required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(subscriptionId as string)) {
            return res.status(400).json({
                status: false,
                message: "Invalid subscription ID"
            });
        }

        const subscription = await UserSubscription.findById(subscriptionId);

        if (!subscription) {
            return res.status(404).json({
                status: false,
                message: "Subscription not found"
            });
        }

        if (subscription.subscriptionStatus === "activated") {
            return res.status(400).json({
                status: false,
                message: "Subscription already activated"
            });
        }

        const plan = await Plan.findById(subscription.plan);
        if (!plan) {
            return res.status(404).json({
                status: false,
                message: "Plan not found"
            });
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + plan.durationInDays);

        await UserSubscription.updateMany(
            {
                user: subscription.user,
                subscriptionStatus: "activated"
            },
            {
                subscriptionStatus: "unsubscribed"
            }
        );

        subscription.subscriptionStatus = "activated";
        subscription.startDate = startDate;
        subscription.endDate = endDate;

        await subscription.save();

        return res.status(200).json({
            status: true,
            message: "Subscription activated successfully",
            data: subscription
        });

    } catch (error: any) {
        return res.status(500).json({
            status: false,
            message: error.message || "Internal server error"
        });
    }
};

export const getUserSubscriptionDetails = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const userSubscription = await UserSubscription.findOne({ user: userId }).select("subscriptionStatus startDate endDate -_id");

        res.status(200).json({
            success: true,
            data: {
                ...(userSubscription?.subscriptionStatus != null && {
                    subscription: userSubscription.subscriptionStatus,
                    subscriptionStartDate: userSubscription?.startDate && formatDate(userSubscription.startDate),
                    subscriptionEndDate: userSubscription?.endDate && formatDate(userSubscription.endDate)
                })
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error,
        });
    }
};