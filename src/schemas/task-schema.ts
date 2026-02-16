import {z} from "zod";

export const createTaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().default(""),
    status: z.enum(["NOT_STARTED", "PENDING", "IN_PROGRESS", "COMPLETED"]).default("NOT_STARTED"),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    status: z.enum(["NOT_STARTED", "PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
    userId: z.string().min(1, "User ID is required").optional(),
});