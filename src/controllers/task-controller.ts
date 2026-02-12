import { FastifyRequest,FastifyReply } from "fastify";
import { createTaskSchema } from "../schemas/task-schema";
import { updateTaskSchema } from "../schemas/task-schema";
import { prisma } from "../lib/prisma";

export class TaskController {
    async createTask(request: FastifyRequest, reply: FastifyReply) {
        const validation = createTaskSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ message: "Validation failed", errors: validation.error.format() });    
        }

        const { title, description} = validation.data;
        const userId = request.user.sub;

        const task = await prisma.task.create({
            data: { title, description, userId },
        })
        
        return reply.status(201).send(task)
    }

    async getTasksByUserId(request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
            const userId = request.user.sub
            const tasks = await prisma.task.findMany({
                where: { userId: userId, isDeleted: false },
            })
            return reply.status(200).send(tasks)
        } catch (error) {
            reply.status(401).send({ error: "Unauthorized" });
        }
    }

    async updateTask(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }
        const validation = updateTaskSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ message: "Validation failed", errors: validation.error.format() });    
        }

        const { title, description, completed, userId } = validation.data;
        const task = await prisma.task.update({
            where: { id },
            data: { title, description, completed, userId },
        })
        return reply.status(200).send(task)
    }

    async deleteTask(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }
        await prisma.task.update({
            where: { id },
            data: { isDeleted: true },
        })
        reply.status(204).send()
        return
    }
}