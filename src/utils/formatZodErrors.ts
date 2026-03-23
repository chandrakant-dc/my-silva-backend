import { z } from "zod";

export const formatZodErrors = (error: z.ZodError) => {
    const formatted: Record<string, string> = {};

    error.issues.forEach((err) => {
        const field = err.path.join(".");

        if (!formatted[field]) {
            formatted[field] = err.message;
        }
    });

    return formatted;
};