import {prisma} from '../lib/prisma';


export class UserRepository {
    async createUser(name: string, email: string, password: string) {
        return await prisma.user.create({
            data: { name, email, password },
        });
    }

    async getAllUsers() {
        return await prisma.user.findMany();
    }

    async deleteUser(id: string) {
        await prisma.user.update({
            where: { id },
            data: { isDeleted: true },
        });
    }

    async updateUser(id: string, name?: string, email?: string, password?: string) {
        const data: any = {};
        if (name) data.name = name;
        if (email) data.email = email;
        if (password) data.password = password;
        return await prisma.user.update({
            where: { id },
            data,
        });
    }
}