import { FastifyRequest, FastifyReply } from "fastify";
import { AdminUpdateUserSchema } from "../schemas/user-schema";
import { AdminService } from "../services/admin-service";

const adminService = new AdminService();

export class AdminController {

    async updateUser(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const data = AdminUpdateUserSchema.parse(request.body);
            try {
            const updatedUser = await adminService.updateUser(id, data);
            const { password: _, ...userWithoutPassword } = updatedUser;
            return reply.status(200).send(userWithoutPassword);
        } catch (error: any) {
            if (error.message === "UserNotFound") {
                return reply.status(404).send({ message: "User not found" });
            }
            if (error.code === 'P2002') {
                return reply.status(400).send({ message: "Email in use" });
            }
            throw error;
        }
    }

    async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
        const users = await adminService.listAllUsers();
        return reply.status(200).send(users);
    }

    async deleteUser(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        await adminService.softDeleteUser(id);
        return reply.status(204).send();
    }

    async getAllTasks(request: FastifyRequest, reply: FastifyReply) {
        const tasks = await adminService.listAllTasks();
        return reply.status(200).send(tasks);
    }
}