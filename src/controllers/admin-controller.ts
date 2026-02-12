import { FastifyRequest,FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export class AdminController {
    async updateUserRole(request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();

            const { id } = request.params as { id: string }
            const { role } = request.body as { role: "USER" | "ADMIN" }
            const user = await prisma.user.update({
                where: { id },
                data: { role },
            })
            return user
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        }
    }
}