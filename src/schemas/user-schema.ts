import {z} from "zod";

export const createUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
});

export const loginUserSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const AdminUpdateUserSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    email: z.email("Invalid email address").optional(),
    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
});