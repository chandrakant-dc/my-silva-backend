import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { formatZodErrors } from "../utils/formatZodErrors.js";

export const validate = <T>(schema: ZodType<T>) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const zodError: ZodError = result.error;
        return res.status(400).json({
            success: false,
            errors: formatZodErrors(zodError),
        });
    }

    next();
};