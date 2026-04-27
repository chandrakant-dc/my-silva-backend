import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token = req.cookies.vctid;

    if (!token) {
        token = req.cookies.vctaid;
    }

    if (!token) {
        return res.status(401).json({ status: false, message: "Unauthorized" });
    }


    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );
        (req as any).user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ status: false, message: "Invalid token" });
    }
};