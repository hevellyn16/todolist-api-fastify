import { FastifyRequest,FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export class TaskController {
    async createTask(request: FastifyRequest, reply: FastifyReply) {
        const { title, description, userId } = request.body as { title: string; description?: string; userId: string }
        const task = await prisma.task.create({
            data: { title, description, userId },
        })
        return task

    }

    async getTasksByUserId(request: FastifyRequest, reply: FastifyReply) {
        const { userId } = request.query as { userId: string }
        const tasks = await prisma.task.findMany({
            where: { userId },
        })
        return tasks  
    }

    async updateTask(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }
        const { title, description, completed } = request.body as { title?: string; description?: string; completed?: boolean }
        const task = await prisma.task.update({
            where: { id },
            data: { title, description, completed },
        })
        return task
    }

    async deleteTask(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }
        await prisma.task.update({
            where: { id },
            data: { isDeleted: true },
        })
        reply.status(204)
        return
    }
}