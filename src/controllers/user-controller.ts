import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt';

export class UserController {
    async createUser(request: FastifyRequest, reply: FastifyReply) {
        const { name, email, password } = request.body as { name: string; email: string; password: string }
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await prisma.user.create({
                data: { name, email, password: hashedPassword },
            })
            return user
        } catch (error) {
            reply.status(409)
            return { error: "Não foi possível concluir o cadastro com os dados informados. Verifique suas informações e tente o login novamente." }
        }
    }

    async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
        const users = await prisma.user.findMany()
        return users  
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
        const { id } = request.params as { id: string }
        const { name, email, password } = request.body as { name?: string; email?: string; password?: string }
        const data: any = {}
        if (name) data.name = name
        if (email) data.email = email
        if (password) data.password = await bcrypt.hash(password, 10)
        const user = await prisma.user.update({
            where: { id },
            data,
        })
        return user
    }
}