import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import { AuthController } from "../controllers/auth-controller";
import { createUserSchema, loginUserSchema } from "../schemas/user-schema";
import { z } from "zod";

const userController = new UserController();
const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
    app.post('/login', { 
        schema: {
            tags: ['Auth'],
            summary: "User login",
            description: "Authenticate a user and return a JWT token",
            body: loginUserSchema,
            response: {
                200: z.object({
                    token: z.string(),
                }),
                401: z.object({
                    error: z.string(),
                }),
                400: z.object({
                    message: z.string(),
                    errors: z.record(z.string(), z.array(z.string())),
                }),
            },
        },
    }, authController.login.bind(authController));
}

export async function userRoutes(app: FastifyInstance) {
    //Create User
    app.post('/users', {
        schema: {
            tags: ['Users'],
            summary: "Create a new user",
            description: "Register a new user in the system",
            body: createUserSchema,
            response: {
                201: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                    role: z.enum(["USER", "ADMIN"]),
                }),
                400: z.object({
                    message: z.string(),
                    errors: z.record(z.string(), z.array(z.string())),
                }),
            },
        },
    },userController.createUser.bind(userController));

    //Update Profile
    app.put('/me', {
        schema: {
            tags: ['Users'],
            summary: "Update user information",
            description: "Update the information of an existing user (Authenticated users can update their own profile, Admin can update any user)",
            body: z.object({
                name: z.string().optional(),
                email: z.email().optional(),
                password: z.string().min(6).optional(),
            }),
            response: {
                200: z.object({
                    id: z.string(),
                    email: z.string(),
                    role: z.enum(["USER", "ADMIN"]),
                }),
                401: z.object({
                    error: z.string(),
                }),
                404: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: [async (request) => await request.jwtVerify()] }, userController.updateProfile.bind(userController));

    //Get Profile with Tasks
    app.get('/profile', {
        schema: {
            tags: ['Users'],
            summary: "Get user profile with tasks",
            description: "Retrieve the authenticated user's profile along with their tasks",
            response: {
                200: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                    role: z.enum(["USER", "ADMIN"]),
                    tasks: z.array(z.object({
                        id: z.string(),
                        title: z.string(),
                        description: z.string().nullable(),                    
                    })),
                }),
                401: z.object({
                    error: z.string(),
                }),
                404: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: [async (request) => await request.jwtVerify()] }, userController.getProfile.bind(userController));
}