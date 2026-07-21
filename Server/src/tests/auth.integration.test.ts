import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import express from "express";
import { AuthRoutes } from "../models/Auth/auth.routes";
import { errorHandler } from "../middlewares/errorHandler.middleware";

let mongoServer: MongoMemoryServer;
let app: express.Express;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use("/api/v1/auth", AuthRoutes);
  app.use(errorHandler);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/v1/auth/signup (integration)", () => {
  it("returns 201 with valid payload", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        password: "password123",
      });

    console.log("Status:", res.status);
    console.log("Body:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("returns 400 with empty body", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({});

    console.log("Empty body status:", res.status);
    console.log("Empty body response:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(400);
  });

  it("returns 400 with missing password", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Test User",
        email: "test2@example.com",
        phone: "1234567891",
      });

    console.log("Missing password status:", res.status);
    console.log("Missing password response:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(400);
  });

  it("returns 400 with invalid email", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Test User",
        email: "not-an-email",
        phone: "1234567892",
        password: "password123",
      });

    console.log("Invalid email status:", res.status);
    console.log("Invalid email response:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(400);
  });
});
