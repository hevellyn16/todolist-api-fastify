import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import { prisma } from "../lib/prisma";
import { AuthController } from "../controllers/auth-controller";

const userController = new UserController();
const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
    app.post('/login', authController.login.bind(authController));
}

export async function userRoutes(app: FastifyInstance) {
    app.post('/users', async (request, reply) => {
        return await userController.createUser(request, reply);
    });

    app.get('/allusers', async (request, reply) => {
        try{
            await request.jwtVerify();
            const users = await prisma.user.findMany();
            return users;
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        };
    });

    app.delete('/users/:id', async (request, reply) => {
        try{
            await request.jwtVerify();
            return await userController.deleteUser(request, reply);
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        };
    });

    app.put('/users/:id', async (request, reply) => {
        try{
            await request.jwtVerify();
            return await userController.updateUser(request, reply);
        } catch (error) {
            reply.status(401)
            return { error: "Unauthorized" }
        };
    });
}