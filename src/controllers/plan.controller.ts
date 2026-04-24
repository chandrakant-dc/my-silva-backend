import type { Request, Response } from "express";
import Plan from "../models/plan.model.js";

export const createPlan = async (req: Request, res: Response) => {
    try {
        const { name, price, durationInDays, dailyLimit } = req.body;

        // Basic validation
        if (!name || price == null || !durationInDays || dailyLimit == null) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Optional: prevent duplicate plans
        const existingPlan = await Plan.findOne({ name });
        if (existingPlan) {
            return res.status(400).json({
                message: "Plan with this name already exists",
            });
        }

        const plan = await Plan.create({
            name,
            price,
            durationInDays,
            dailyLimit,
        });

        return res.status(201).json({
            message: "Plan created successfully",
            data: plan,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error?.message || error,
        });
    }
};


export const getAllPlan = async (req: Request, res: Response) => {
    try {
        const plans = await Plan.find({}, '-createdAt -updatedAt -__v');
        return res.status(200).json({
            message: "Plan fetched successfully",
            data: plans,
        });
    } catch (error: any) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error?.message || error,
        });
    }
}