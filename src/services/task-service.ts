import { TaskRepository } from "../repositories/task-repository";

export class TaskService {
    constructor(private taskRepository: TaskRepository) {}
    
    async createTask(title: string, description: string | undefined, userId: string) {
        return await this.taskRepository.createTask(title, description, userId);
    }

    async getTasksByUserId(userId: string) {
        return await this.taskRepository.getTasksByUserId(userId);
    }

    async updateTask(id: string, title?: string, description?: string, completed?: boolean, userId?: string) {
        return await this.taskRepository.updateTask(id, title, description, completed, userId);
    }
}