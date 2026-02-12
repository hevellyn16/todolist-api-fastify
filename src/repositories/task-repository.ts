import {prisma} from '../lib/prisma'

export class TaskRepository {
    async createTask(title: string, description: string | undefined, userId: string) {
        return await prisma.task.create({
            data: { title, description, userId },
        });
    }

    async getTasksByUserId(userId: string) {
        return await prisma.task.findMany({
            where: { userId },
        });
    }

    async updateTask(id: string, title?: string, description?: string, completed?: boolean, userId?: string) {
        return await prisma.task.update({
            where: { id },
            data: { title, description, completed, userId },
        });
    }

    async deleteTask(id: string) {
        await prisma.task.update({
            where: { id },
            data: { isDeleted: true },
        });
    }
}