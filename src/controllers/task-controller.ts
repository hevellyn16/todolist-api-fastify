import { FastifyRequest, FastifyReply } from "fastify";
import { createTaskSchema, updateTaskSchema } from "../schemas/task-schema";
import { TaskService } from "../services/task-service";

const taskService = new TaskService();

export class TaskController {
    async createTask(request: FastifyRequest, reply: FastifyReply) {
        try{
            const { title, description } = createTaskSchema.parse(request.body);
            const task = await taskService.create(title, description, request.user.sub);
            return reply.status(201).send(task);
        } catch (error: any) {
            if (error.code === 'P2002') {
                return reply.status(400).send({ message: "Task title already exists" });
            }
            return reply.status(500).send({ message: "Internal server error" });
        }
    }

    async getMyTasks(request: FastifyRequest, reply: FastifyReply) {
        try {
            const tasks = await taskService.getByUserId(request.user.sub);
            return reply.status(200).send(tasks);
        } catch (error) {
            return reply.status(401).send({ error: "Unauthorized" });
        }
    }

    async deleteTask(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        await taskService.delete(id, request.user.sub);
        return reply.status(204).send();
    }

    async updateTask(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const data = updateTaskSchema.parse(request.body);
            const updatedTask = await taskService.update(id, request.user.sub, data);
            return reply.status(200).send(updatedTask);
        } catch (error: any) {
            if (error.message === "TaskNotFound") {
                return reply.status(404).send({ message: "Task not found" });
            }
            return reply.status(500).send({ message: "Internal server error" });
        }
    }

    async getTaskById(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const task = await taskService.getById(id, request.user.sub);
            if (!task) {
                return reply.status(404).send({ message: "Task not found" });
            }
            return reply.status(200).send(task);
        } catch (error) {
            return reply.status(500).send({ message: "Internal server error" });
        }
    }
}