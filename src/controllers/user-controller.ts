import { FastifyRequest, FastifyReply } from "fastify";
import { createUserSchema, updateUserSchema } from "../schemas/user-schema";
import { UserService } from "../services/user-service";

const userService = new UserService();

export class UserController {
    async createUser(request: FastifyRequest, reply: FastifyReply) {
        const body = createUserSchema.parse(request.body);
        try {
            const user = await userService.create(body);
            const { password: _, ...userWithoutPassword } = user;
            return reply.status(201).send(userWithoutPassword);
        } catch (error: any) {
            if (error.code === 'P2002') return reply.status(400).send({ message: "Email in use" });
            throw error;
        }
    }

    async getProfile(request: FastifyRequest, reply: FastifyReply) {
        const user = await userService.getProfile(request.user.sub);
        const { password: _, ...userWithoutPassword } = user;
        return reply.status(200).send(userWithoutPassword);
    }

    async updateProfile(request: FastifyRequest, reply: FastifyReply) {
        const body = updateUserSchema.parse(request.body);
        try {
            const user = await userService.updateProfile(request.user.sub, body);
            const { password: _, ...userWithoutPassword } = user;
            return reply.status(200).send(userWithoutPassword);
        } catch (error: any) {
            if (error.message === "UserNotFound") {
                return reply.status(404).send({ message: "User not found" });
            }
            if (error.code === 'P2002') {
                return reply.status(400).send({ message: "Email in use" });
            }
            throw error;
        };
    }
}