import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const optionalAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.vctid;

    if (!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        );

        (req as any).user = decoded;
        next();
    } catch (err) {
        return next();
    }
};