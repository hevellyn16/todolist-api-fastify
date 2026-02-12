import { FastifyRequest,FastifyReply } from "fastify";
import { loginUserSchema } from "../schemas/user-schema";
import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt';

export class AuthController {
    async login(request: FastifyRequest, reply: FastifyReply) {
        const validation = loginUserSchema.safeParse(request.body);
        if (!validation.success) {
            return reply.status(400).send({ message: "Validation failed", errors: validation.error.format() });
        }

        const { email, password } = validation.data;
        const user = await prisma.user.findUnique({
            where: { email },
        });

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