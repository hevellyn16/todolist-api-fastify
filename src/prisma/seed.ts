import { prisma } from "../lib/prisma";
import bcrypt from 'bcrypt';

async function main() {

    console.log("Cleaning database...");
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();
    const hashedPassword = await bcrypt.hash("senha-admin_123", 10);
    await prisma.user.create({
        data: {
            name: "Admin Principal",
            email: "admin@exemplo.com",
            password: hashedPassword,
            role: "ADMIN"
        }
    });

    console.log("Admin created sucessfully");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });