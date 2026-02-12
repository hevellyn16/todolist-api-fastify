import { prisma } from "../lib/prisma";
import { User, Task, Prisma } from "@prisma/client";

export class AdminRepository {
    //List all users, even the deleted ones
    async findAllUsers(includeDeleted = false): Promise<User[]> {
        return await prisma.user.findMany({
            where: includeDeleted ? {} : { isDeleted: false },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateAnyUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return await prisma.user.update({
            where: { id },
            data
        });
    }

    // List all tasks in the system, including the user info, but only the active ones
    async findAllTasksInSystem(): Promise<Task[]> {
        return await prisma.task.findMany({
            where: { isDeleted: false },
            include: { 
                user: { 
                    select: { name: true, email: true } 
                } 
            }
        });
    }

    async findTaskById(id: string): Promise<Task | null> {
        return await prisma.task.findUnique({ where: { id } });
    }
}