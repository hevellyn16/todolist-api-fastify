import { prisma } from "../lib/prisma";
import { Prisma, Task } from "@prisma/client";

export class TaskRepository {
    async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
        return await prisma.task.create({ data });
    }

    async findById(id: string): Promise<Task | null> {
        return await prisma.task.findUnique({
            where: { id }
        });
    }

    async findManyByUserId(userId: string): Promise<Task[]> {
        return await prisma.task.findMany({
            where: { 
                userId, 
                isDeleted: false 
            },
            orderBy: { createdAt: 'desc' } 
        });
    }

    async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
        return await prisma.task.update({
            where: { id },
            data
        });
    }

    async findAllActive(): Promise<Task[]> {
        return await prisma.task.findMany({
            where: { isDeleted: false },
            include: { user: { select: { name: true } } }
        });
    }
}