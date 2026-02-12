import { it, expect, describe, beforeAll } from "vitest";
import request from "supertest";
import { app } from "../src/app";

describe("User Tests", () => {
    beforeAll(async () => {
        await app.ready();
    });

    it("should create a new user", async () => {
        const loginResponse = await request(app.server)
            .post("/users")
            .send({
                name: "Test User",
                email: "testuser@example.com",
                password: "password123"
            });
        const {token} = loginResponse.body;

        //Acess admin route
        const response = await request(app.server)
            .get("/admin/allusers")
            .set("Authorization", `Bearer ${token}`);

        //If status is 403, it means the user was created but doesn't have admin privileges, which is expected for a regular user.
        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("error", "Forbidden: You don't have access to this resource");

        it("can access their own profile", async () => {
            const loginResponse = await request(app.server)
                .post("/users")
                .send({
                    name: "Test User",
                    email: "testuser@example.com",
                    password: "password123"
                });
            const {token} = loginResponse.body;

            const profileResponse = await request(app.server)
                .get("/me")
                .set("Authorization", `Bearer ${token}`);
            expect(profileResponse.status).toBe(200);
            expect(profileResponse.body).toHaveProperty("id");
            expect(profileResponse.body).toHaveProperty("name", "Test User");
            expect(profileResponse.body).toHaveProperty("email", "testuser@example.com");
        })
        });
});
