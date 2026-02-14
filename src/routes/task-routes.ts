import { FastifyInstance } from "fastify";
import { TaskController } from "../controllers/task-controller";
import { loginUserSchema } from "../schemas/user-schema";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "../schemas/task-schema";
import { stat } from "node:fs";

const taskController = new TaskController();
const ResponseSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional().nullable(),
    status: z.enum(["NOT_STARTED", "PENDING", "IN_PROGRESS", "COMPLETED"]),
    userId: z.string(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
});

export async function taskRoutes(app: FastifyInstance) {
    //Create Task
    app.post('/tasks', { 
        schema: {
            tags: ['Tasks'],
            summary: "Create a new task",
            description: "Create a new task for the authenticated user",
            body: createTaskSchema,
            response: {
                201: ResponseSchema,
                400: z.object({
                    message: z.string(),
                    errors: z.record(z.string(), z.array(z.string())),
                }),
                500: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: [async (request) => await request.jwtVerify()] },
    taskController.createTask.bind(taskController));

    //Get all Tasks by User ID
    app.get('/tasks', { 
        schema: {
            tags: ['Tasks'],
            summary: "Get all tasks for the authenticated user",
            description: "Retrieve all tasks associated with the authenticated user",
            response: {
                200: z.array(ResponseSchema),
                500: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: [async (request) => await request.jwtVerify()] }, 
    taskController.getMyTasks.bind(taskController));


    //Update Task
    app.put('/tasks/:id', {
        schema: {
            tags: ['Tasks'],
            summary: "Update a task",
            description: "Update a task by its ID for the authenticated user",
            params: z.object({
                id: z.string(),
            }),
            body: updateTaskSchema,
            response: {
                200: z.object({
                    id: z.string(),
                    title: z.string(),
                    description: z.string(),
                }),
                401: z.object({
                    error: z.string(),                
                }),
                404: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: [async (request) => await request.jwtVerify()] }, taskController.updateTask.bind(taskController));

    //Get Task by ID
    app.get('/tasks/:id', {
        schema: {
            tags: ['Tasks'],
            summary: "Get a task by ID",
            description: "Retrieve a task by its ID for the authenticated user",
            params: z.object({
                id: z.string(),
            }),
            response: {
                200: ResponseSchema,
                401: z.object({
                    error: z.string(),
                }),
                404: z.object({
                    message: z.string(),
                }),
            },
        },
        preHandler: [async (request) => await request.jwtVerify()] }, taskController.getTaskById.bind(taskController));

    //Delete Task
    app.delete('/tasks/:id', {
        schema: {
            tags: ['Tasks'],
            summary: "Delete a task",
            description: "Delete a task by its ID for the authenticated user",
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
        preHandler: [async (request) => await request.jwtVerify()] }, taskController.deleteTask.bind(taskController));
        
}