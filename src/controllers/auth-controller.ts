import { FastifyRequest, FastifyReply } from "fastify";
import { loginUserSchema } from "../schemas/user-schema";
import { AuthService } from "../services/auth-service";

const authService = new AuthService();

export class AuthController {
    async login(request: FastifyRequest, reply: FastifyReply) {
        const { email, password } = loginUserSchema.parse(request.body);
        const user = await authService.validateUser(email, password);

        if (!user) {
            return reply.status(401).send({ error: "Invalid email or password" });
        }

        const token = await reply.jwtSign({ role: user.role }, {
            sub: user.id,
            expiresIn: '7d',
        });

        return reply.status(200).send({ token });
    }
}