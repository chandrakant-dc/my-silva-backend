// import { z } from "zod";

// export const createAdminSchema = z.object({
//     email: z.email(),
//     password: z.string().min(6, "Password must be at least 6 chars"),
// });

// export type CreateAdminInput = z.infer<typeof createAdminSchema>;

import { z } from "zod";

export const createAdminSchema = z.object({
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
});

export type CreateAdminInput = z.infer<typeof createAdminSchema>;