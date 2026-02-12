import { FastifyInstance} from "fastify";
import { AdminController } from "../controllers/admin-controller";
import { authorize } from "../middlewares/rbac";
import { z } from "zod";



export async function adminRoutes(app: FastifyInstance) {
    const adminController = new AdminController();
    app.put('/admin/users/:id', {  
        schema: {
            tags: ['Admin'],
            summary: "Admin update user information",
            description: "Admin can update any user's information",
            params: z.object({
                id: z.string(),
            }),
            body: z.object({
                name: z.string().optional(),
                email: z.email().optional(),
                password: z.string().optional(),
                role: z.enum(["USER", "ADMIN"]).optional(),
            }),
            response: {
                200: z.object({
                    id: z.string(),
                    name: z.string(),
                    email: z.string(),
                    role: z.enum(["USER", "ADMIN"]),
                }),
                400: z.object({
                    message: z.string(),
                    errors: z.record(z.string(), z.array(z.string())),
                }),
                403: z.object({
                    error: z.string(),                
                }),
                404: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: authorize(["ADMIN"]) }, adminController.updateUser.bind(adminController));

    //Get all Users
        app.get('/admin/allusers', {
            schema: {
                tags: ['Admin'],
                summary: "Get all users",
                description: "Retrieve a list of all registered users (Admin only)",
                response: {
                    200: z.array(z.object({
                        id: z.string(),
                        name: z.string(),
                        email: z.string(),
                        role: z.enum(["USER", "ADMIN"]),
                    })),
                    401: z.object({
                        error: z.string(),
                    }),
                },
            },
        preHandler: authorize(["ADMIN"]) }, adminController.getAllUsers.bind(adminController));

    //Get all Tasks (Admin)
        app.get('/admin/tasks', { 
            schema: {
                tags: ['Admin'],
                summary: "Get all tasks (Admin)",
                description: "Retrieve all tasks for admin users",
                response: {
                    200: z.array(z.object({
                        id: z.string(),
                        title: z.string(),
                        description: z.string(),
                    })),
                    401: z.object({
                        error: z.string(),
                    }),
                },
            },
            preHandler: authorize(["ADMIN"]) }, adminController.getAllTasks.bind(adminController));
        
    //Delete User
    app.delete('/admin/users/:id', { 
        schema: {
            tags: ['Admin'],
            summary: "Delete a user",
            description: "Soft delete a user by setting isDeleted to true (Admin only)",
            params: z.object({
                id: z.string(),
            }),
            response: {
                204: z.null(),
                401: z.object({
                    error: z.string(),
                }),
                404: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: authorize(["ADMIN"]) }, adminController.deleteUser.bind(adminController));
}
