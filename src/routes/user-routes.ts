import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user-controller";
import { AuthController } from "../controllers/auth-controller";
import { AdminController } from "../controllers/admin-controller";
import { authorize } from "../middlewares/rbac";

const userController = new UserController();
const authController = new AuthController();

export async function authRoutes(app: FastifyInstance) {
    app.post('/login', authController.login.bind(authController));
}

export async function adminRoutes(app: FastifyInstance) {
    const adminController = new AdminController();
    app.put('/admin/users/:id/role', { preHandler: authorize(["ADMIN"]) }, adminController.updateUserRole.bind(adminController));
}

export async function userRoutes(app: FastifyInstance) {
    //Create User
    app.post('/users', userController.createUser.bind(userController));

    //Get all Users
    app.get('/allusers', { preHandler: authorize(["ADMIN"]) }, userController.getAllUsers.bind(userController));

    //Delete User
    app.delete('/users/:id', { preHandler: authorize(["ADMIN"]) }, userController.deleteUser.bind(userController));

    //Update User
    app.put('/users/:id', { preHandler: authorize(["ADMIN", "USER"]) }, userController.updateUser.bind(userController));
}