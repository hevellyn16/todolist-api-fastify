import { FastifyRequest, FastifyReply } from "fastify";
import { createUserSchema, updateUserSchema } from "../schemas/user-schema";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt';

export class UserController {
    async createUser(request: FastifyRequest, reply: FastifyReply) {
            const validation = createUserSchema.safeParse(request.body);
            if (!validation.success) {
                return reply.status(400).send({ message: "Validation failed", errors: validation.error.format() });    
            }

            const { name, email, password } = validation.data;
            const hashedPassword = await bcrypt.hash(password, 10);

            try {
            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword },
            })
            return reply.status(201).send(user)
        } catch (error:any) {
            if (error.code === 'P2002') {
                return reply.status(400).send({ message: "It's not possible to create the user with the provided data." });
            }
            return reply.status(500).send({ message: "Internal server error" });
        }
    }

    async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
        const users = await prisma.user.findMany({
            where: { isDeleted: false },
        })
        return reply.status(200).send(users)
    }

    async deleteUser(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string }
        await prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        })
        reply.status(204)
        return
    }

    async updateUser(request: FastifyRequest, reply: FastifyReply) {
        const validation = updateUserSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ message: "Validation failed", errors: validation.error.format() });    
        }

        try {
            await request.jwtVerify();
            const { id } = request.params as { id: string }
            const { name, email, password } = request.body as { name?: string; email?: string; password?: string }
            const data: any = {};
            if (name) data.name = name;
            if (email) data.email = email;
            if (password) data.password = await bcrypt.hash(password, 10);
            const user = await prisma.user.update({
                where: { id },
                data,
            })
            return reply.status(200).send(user)
        } catch (error) {
            reply.status(401).send({ error: "Unauthorized" });
        }
    }
}