import { FastifyInstance } from "fastify";
import { TaskController } from "../controllers/task-controller";
import jwt from '@fastify/jwt';
import { prisma } from "../lib/prisma";

const taskController = new TaskController();

export async function taskRoutes(app: FastifyInstance) {
    app.post('/tasks', async (request, reply) => {
        try{
            await request.jwtVerify();
            const task = prisma.task.create({
                data: {
                    title: (request.body as { title: string }).title,
                    description: (request.body as { description?: string }).description,
                    userId: request.user.sub,
                },
            });
            return task;    
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        }
    });

    app.get('/tasks', async (request, reply) => {
        try{
            await request.jwtVerify();
            return await taskController.getTasksByUserId(request, reply);
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        }
    });

    app.put('/tasks/:id', async (request, reply) => {
        try{
            await request.jwtVerify();
            return await taskController.updateTask(request, reply);
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        }
    });

    app.delete('/tasks/:id', async (request, reply) => {
        try{
            await request.jwtVerify();
            return await taskController.deleteTask(request, reply);
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        }
    });
}