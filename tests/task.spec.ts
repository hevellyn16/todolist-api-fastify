import { it, expect, describe, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("Task Integration Tests", () => {
    let userToken: string;

    beforeAll(async () => {
        await app.ready();
    });

    beforeEach(async () => {
        // Clean the database before each test to ensure a fresh state
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});

        // Create a user and get the token for authentication
        await request(app.server).post("/users").send({
            name: "Task Test User",
            email: "task.test.user@example.com",
            password: "password123"
        });

        const authResponse = await request(app.server).post("/login").send({
            email: "task.test.user@example.com",
            password: "password123"
        });
        userToken = authResponse.body.token;
    });

    it("should be able to create a new task", async () => {
        const response = await request(app.server)
            .post("/tasks")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Estudar Eletromagnetismo",
                description: "Revisar as equações de Maxwell"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.title).toBe("Estudar Eletromagnetismo");
    });

    it("should be able to list user tasks", async () => {
        // Create a task first
        await prisma.task.create({
            data: {
                title: "Task de Teste",
                userId: (await prisma.user.findUnique({ where: { email: "task.test.user@example.com" } }))!.id
            }
        });

        const response = await request(app.server)
            .get("/tasks") // Ajuste para a sua rota de listagem (ex: /me/tasks)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should be able to update a task", async () => {
        // Create a task first
        const task = await prisma.task.create({
            data: {
                title: "Task para Atualizar",
                userId: (await prisma.user.findUnique({ where: { email: "task.test.user@example.com" } }))!.id
            }
        });

        const response = await request(app.server)
            .put(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Task Atualizada",
                description: "Descrição atualizada"
            });
        
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("Task Atualizada");
        expect(response.body.description).toBe("Descrição atualizada");
    });

    it("should be able to delete a task", async () => {
        // Create a task first
        const task = await prisma.task.create({
            data: {
                title: "Task para Deletar",
                userId: (await prisma.user.findUnique({ where: { email: "task.test.user@example.com" } }))!.id
            }
        });

        const response = await request(app.server)
            .delete(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(204);
    });

    it("should not allow unauthorized access to tasks", async () => {
        const response = await request(app.server).get("/tasks");
            
        expect(response.status).toBe(401);
    });
});