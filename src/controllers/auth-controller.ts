import { FastifyRequest,FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt';

export class AuthController {
    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = request.body as { email: string; password: string }
        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            reply.status(401)
            return { error: "Invalid credentials" }
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            reply.status(401)
            return { error: "Invalid credentials" }
        }


        const token = await reply.jwtSign({ sub: user.id}, { expiresIn: '1h' })
        return { token }
    }
}