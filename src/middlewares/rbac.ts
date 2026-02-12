import { FastifyRequest,FastifyReply } from "fastify";

export function authorize(roles: ("USER" | "ADMIN")[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();

            const userRole = request.user.role;
            if (!roles.includes(userRole)) {
                reply.status(403);
                return { error: "Access denied. Insufficient permissions." };
            }
        } catch (error) {
            reply.status(401);
            return { error: "Unauthorized" };
        }

    }
}