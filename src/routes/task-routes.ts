import { FastifyInstance } from "fastify";
import { TaskController } from "../controllers/task-controller";
import { prisma } from "../lib/prisma";
import { authorize } from "../middlewares/rbac";

const taskController = new TaskController();

export async function taskRoutes(app: FastifyInstance) {
    //Create Task
    app.post('/tasks', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.createTask.bind(taskController));

    //Get all Tasks by User ID
    app.get('/tasks', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.getTasksByUserId.bind(taskController));

    //Update Task
    app.put('/tasks/:id', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.updateTask.bind(taskController));

    //Delete Task
    app.delete('/tasks/:id', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.deleteTask.bind(taskController));
        
}