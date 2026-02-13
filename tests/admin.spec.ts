import { it, expect, describe, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";
import bcrypt from 'bcrypt';

describe("Admin Integration Tests", () => {
    let adminToken: string;

    beforeAll(async () => {
        await app.ready();
    });

    beforeEach(async () => {
        // Clean the database before each test to ensure a fresh state
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});

        // Create an admin user and get the token for authentication
        await prisma.user.create({
            data: {
                name: "Admin Test",
                email: "admin_test@example.com",
                password: await bcrypt.hash("adminpassword", 10),
                role: "ADMIN"
            }
        });

        const authResponse = await request(app.server).post("/login").send({
            email: "admin_test@example.com",
            password: "adminpassword"
        });
        adminToken = authResponse.body.token;
    });

    it("should be able to list all users as admin", async () => {
        // Create a regular user to ensure there is at least one non-admin user in the list
        await request(app.server).post("/users").send({
            name: "Regular User",
            email: "regular_user@example.com",
            password: "userpassword",
            role: "USER"
        });

        const response = await request(app.server)
            .get("/admin/allusers")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should be able to update a user's information as admin", async () => {
        // Create a user to update
        const userResponse = await request(app.server).post("/users").send({
            name: "User To Update",
            email: "user_to_update@example.com",
            password: "updatepassword",
            role: "USER"
        });
        const userId = userResponse.body.id;

        const updateResponse = await request(app.server)
            .put(`/admin/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`)
            .send({ name: "Updated User Name", role: "ADMIN" });

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.name).toBe("Updated User Name");
        expect(updateResponse.body.role).toBe("ADMIN");
    });

    it("should be able to delete a user as admin", async () => {
        // Create a user to delete
        const userResponse = await request(app.server).post("/users").send({
            name: "User To Delete",
            email: "user_to_delete@example.com",
            password: "deletepassword",
            role: "USER"
        });
        const userId = userResponse.body.id;

        const deleteResponse = await request(app.server)
            .delete(`/admin/users/${userId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(deleteResponse.status).toBe(204);
    });

    
});