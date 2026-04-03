import { z } from "zod";

export const createUserSchema = z.object({
    fullName: z.string(),
    mobile: z.string({
        error: (issue) => issue.input === undefined
            ? "mobile is required"
            : "invalid mobile number"
    }).max(10, "must be 10 digit"),
    email: z.email({
        error: (issue) => issue.input === undefined
            ? "email is required"
            : "invalid email"
    }),
    password: z.string({
        error: (issue) => issue.input === undefined
            ? "password is required"
            : "Not a string"
    }).min(6, "Password must be at least 6 chars"),
})

export const loginUserSchema = z.object({
    email: z.email({
        error: (issue) => issue.input === undefined
            ? "email is required"
            : "invalid email"
    }),
    password: z.string({
        error: (issue) => issue.input === undefined
            ? "password is required"
            : "Not a string"
    }).min(6, "Password must be at least 6 chars"),
})