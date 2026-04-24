import type { Request, Response } from "express";
import { GuestSession } from "../models/session.model.js";
import { UserDaily } from "../models/userDaily.model.js";
import { UserTotal } from "../models/userTotal.model.js";


interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}


export const trackTime = async (req: AuthRequest, res: Response) => {
    try {
        const { timeSpent, guestId } = req.body;
        const userId = req?.user?.id;

        if (!timeSpent || timeSpent <= 0) {
            return res.status(400).json({ message: "Invalid timeSpent" });
        }

        if (userId) {
            const today = new Date().toISOString().split("T")[0] || "Incorrect date";

            await Promise.all([

                UserTotal.updateOne(
                    { userId },
                    {
                        $inc: { totalTime: timeSpent },
                        $set: { lastActive: new Date() },
                    },
                    { upsert: true }
                ),

                UserDaily.updateOne(
                    { userId, date: today },
                    {
                        $inc: { time: timeSpent },
                    },
                    { upsert: true }
                ),
            ]);

            return res.json({ success: true, type: "user" });
        }

        if (!guestId) {
            return res.status(400).json({ message: "guestId required" });
        }

        const session = await GuestSession.findOneAndUpdate(
            { guestId },
            {
                $inc: { totalTime: timeSpent },
                $set: { lastActive: new Date() },
            },
            { upsert: true, new: true }
        );

        return res.json({ success: true, type: "guest", session });

    } catch (error) {
        return res.status(500).json({ message: "Tracking failed", error });
    }
};

export const getUserTrackedTime = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req?.user?.id;

        if (!userId) {
            return res.status(400).json({ message: "user not found" });
        }

        const today = new Date().toISOString().split("T")[0] || "incorrect date";

        const userTotal = await UserTotal.findOne({ userId });

        const todayData = await UserDaily.findOne({
            userId,
            date: today,
        }).select("date time -_id");

        return res.json({
            success: true,
            data: {
                totalTime: userTotal?.totalTime || 0,
                todayTime: todayData || { date: today, time: 0 },
            },
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};