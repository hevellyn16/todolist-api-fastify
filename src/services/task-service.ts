import { TaskRepository } from "../repositories/task-repository";

const taskRepository = new TaskRepository();

export class TaskService {
    async create(title: string, description: string | undefined, userId: string) {
        if (!title.trim()) throw new Error("TitleRequired");

        return await taskRepository.create({ title, description, userId });
    }

    async update(id: string, userId: string, data: any) {
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
}