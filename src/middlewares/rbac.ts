import { FastifyRequest,FastifyReply } from "fastify";

export function authorize(roles: ("USER" | "ADMIN")[]) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            await request.jwtVerify();

            const userRole = request.user.role;

            //Role Debug
            /*console.log("DEBUG - Role que veio no Token:", userRole);
            console.log("DEBUG - Roles permitidos para acessar o recurso:", roles); */

            if (!roles.includes(userRole)) {
                reply.status(403).send({ error: "You do not have permission to access this resource" });
                return;
            }
        } catch (error) {
            reply.status(401).send({ error: "Unauthorized" });
        }

    }
}