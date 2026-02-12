import { prisma } from "../lib/prisma";
import { User } from "@prisma/client";

export class AuthRepository {
    async findUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({
            where: { email },
        });
    }
}