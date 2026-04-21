import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Session } from "../models/session.model.js";
export const trackTime = async (req: Request, res: Response) => {
    try {
        const { timeSpent, guestId } = req.body;
        const token = req.cookies.token;

        if (token) {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET as string
            );
            (req as any).user = decoded;
        }

        const userId = (req as any).user?.id;

        if (!timeSpent) {
            return res.status(400).json({ message: "timeSpent required" });
        }

        const query = userId ? { userId } : { guestId };

        if (!query.userId && !query.guestId) {
            return res.status(400).json({ message: "No identifier provided" });
        }

        const session = await Session.findOneAndUpdate(
            query,
            {
                $inc: { totalTime: timeSpent },
                $set: { lastActive: new Date() },
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, session });
    } catch (error) {
        res.status(500).json({ message: "Tracking failed", error });
    }
};