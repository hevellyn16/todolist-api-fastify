import { it, expect, describe, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/lib/prisma";

describe("User Tests", () => {
    let userToken: string;
    beforeAll(async () => {
        await app.ready();
    });

    // Clean the database before each test to avoid "Email already registered" errors
    beforeEach(async () => {
        await prisma.task.deleteMany({});
        await prisma.user.deleteMany({});

        await request(app.server).post("/users").send({
            name: "User Test",
                    email: "user.test@example.com",
                    password: "password123"
                });
        
            const authResponse = await request(app.server).post("/login").send({
                    email: "user.test@example.com",
                    password: "password123"
            });
        userToken = authResponse.body.token;
    });

    it("should create a new user and deny admin access", async () => {

        const response = await request(app.server)
            .get("/admin/allusers")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error", "You do not have permission to access this resource");
    });

    it("can access their own profile", async () => {
        const profileResponse = await request(app.server)
            .get("/profile")
            .set("Authorization", `Bearer ${userToken}`);

        expect(profileResponse.status).toBe(200);
        expect(profileResponse.body).toHaveProperty("name", "User Test");
        expect(profileResponse.body).toHaveProperty("email", "user.test@example.com");
        expect(profileResponse.body).toHaveProperty("role", "USER" );
    });
}); 