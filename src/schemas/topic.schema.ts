import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
    .string()
    .trim()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid ObjectId",
    });

export const createTopicSchema = z.object({
    categoryId: objectIdSchema,
    subcategoryId: objectIdSchema,

    topicName: z
        .string()
        .trim()
        .min(1, "Topic name is required"),

    description: z
        .string()
        .trim()
        .min(1, "Description is required"),

    questions: z
        .array(
            z.object({
                question: z.string().trim().min(1, "Question is required"),
                option1: z.string().trim().min(1, "Option 1 cannot be empty"),
                option2: z.string().trim().min(1, "Option 2 cannot be empty"),
                option3: z.string().trim().min(1, "Option 3 cannot be empty"),
                option4: z.string().trim().min(1, "Option 4 cannot be empty"),
                answer: z.string().trim().min(1, "Answer is required"),
            })
        )
        .min(1, "At least one question is required"),
});

export type CreateTopicInput = z.infer<typeof createTopicSchema>;