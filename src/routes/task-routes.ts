import { FastifyInstance } from "fastify";
import { TaskController } from "../controllers/task-controller";
import { AdminController } from "../controllers/admin-controller";
import { authorize } from "../middlewares/rbac";

const taskController = new TaskController();
const adminController = new AdminController();

export async function taskRoutes(app: FastifyInstance) {
    //Create Task
    app.post('/tasks', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.createTask.bind(taskController));

    //Get all Tasks by User ID
    app.get('/tasks', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.getTasksByUserId.bind(taskController));

    //Get all Tasks (Admin)
    app.get('/admin/tasks', { preHandler: authorize(["ADMIN"]) }, adminController.getAllTasks.bind(adminController));

    //Update Task
    app.put('/tasks/:id', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.updateTask.bind(taskController));

    //Delete Task
    app.delete('/tasks/:id', { preHandler: authorize(["USER", "ADMIN"]) }, taskController.deleteTask.bind(taskController));
        
}