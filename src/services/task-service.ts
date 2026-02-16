import { Prisma } from "@prisma/client";
import { TaskRepository } from "../repositories/task-repository";

const taskRepository = new TaskRepository();

export class TaskService {
    async create(data: any, userId: string) {
        const { title, description, status } = data;
        if (!title.trim()) throw new Error("TitleRequired");

        return await taskRepository.create({
            title,
            description,
            status: (status as any || "NOT_STARTED"),
            userId,
        });
    }

    async update(id: string, userId: string, data: Prisma.TaskUpdateInput) {
        const task = await taskRepository.findById(id);

        if (!task || task.userId !== userId) {
            throw new Error("TaskNotFound");
        }

        return await taskRepository.update(id, data);
    }

    async delete(id: string, userId: string) {
        const task = await taskRepository.findById(id);

        if (!task || task.userId !== userId) {
            throw new Error("TaskNotFound");
        }

        return await taskRepository.update(id, { isDeleted: true });
    }

    async getByUserId(userId: string) {
        return await taskRepository.findManyByUserId(userId);
    }

    async getById(id: string, userId: string) {
        const task = await taskRepository.findById(id);
        if (!task || task.userId !== userId) {
            return null;
        }
        return task;
    }
}