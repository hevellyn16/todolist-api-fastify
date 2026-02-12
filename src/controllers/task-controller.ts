import { FastifyRequest, FastifyReply } from "fastify";
import { createTaskSchema, updateTaskSchema } from "../schemas/task-schema";
import { TaskService } from "../services/task-service";

const taskService = new TaskService();

export class TaskController {
    async createTask(request: FastifyRequest, reply: FastifyReply) {
        const { title, description } = createTaskSchema.parse(request.body);
        const task = await taskService.create(title, description, request.user.sub);
        return reply.status(201).send(task);
    }

    async getMyTasks(request: FastifyRequest, reply: FastifyReply) {
        const tasks = await taskService.getByUserId(request.user.sub);
        return reply.status(200).send(tasks);
    }

    async deleteTask(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        await taskService.delete(id, request.user.sub);
        return reply.status(204).send();
    }

    async updateTask(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const data = updateTaskSchema.parse(request.body);
        const updatedTask = await taskService.update(id, request.user.sub, data);
        return reply.status(200).send(updatedTask);
    }
}