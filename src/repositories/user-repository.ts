import { prisma } from "../lib/prisma";
import { Prisma, User } from "@prisma/client";

export class UserRepository {
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({ data });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
    }
    
    async findById(id: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { id },
            include: { tasks: { where: { isDeleted: false } } }
        });
    }

    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return await prisma.user.update({ where: { id }, data });
    }
}