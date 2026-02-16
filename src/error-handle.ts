import { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export const errorHandler: FastifyInstance["errorHandler"] = (error, request, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({ message: "Validation failed", errors: error.flatten().fieldErrors });
    }

    if ((error as any).code === 'P2002') {
        return reply.status(409).send({ message: "Unique constraint failed", errors: (error as any).meta });
    }

    if ((error as any).statusCode === 401) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    if ((error as any).statusCode === 403) {
        return reply.status(403).send({ message: "Forbidden" });
    }

    return reply.status(500).send({ message: "Internal server error" });
}