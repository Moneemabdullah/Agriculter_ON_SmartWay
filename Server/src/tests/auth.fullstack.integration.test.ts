import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { globalRateLimiter } from "../middlewares/rateLimit.middleware";
import { errorHandler } from "../middlewares/errorHandler.middleware";
import { AuthRoutes } from "../models/Auth/auth.routes";
import { validate } from "../middlewares/validate.middleware";
import { signupSchema } from "../validations/auth.validation";

let mongoServer: MongoMemoryServer;
let app: express.Express;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(cors());
  app.use(globalRateLimiter);
  app.use("/api/v1/auth", AuthRoutes);
  app.use(errorHandler);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("POST /api/v1/auth/signup (full stack)", () => {
  it("returns 201 with valid payload through full middleware stack", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({
        name: "Full Stack User",
        email: "fullstack@example.com",
        phone: "0987654321",
        password: "password123",
      });

    console.log("Full stack status:", res.status);
    console.log("Full stack body:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("returns 400 with empty body through full stack", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .send({});

    console.log("Full stack empty status:", res.status);
    console.log("Full stack empty body:", JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(400);
  });
});

describe("Edge case: Content-Type manipulation", () => {
  it("handles missing Content-Type header", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .set("Content-Type", "")
      .send(JSON.stringify({
        name: "No CT User",
        email: "noct@example.com",
        phone: "5555555555",
        password: "password123",
      }));

    console.log("No CT status:", res.status);
    console.log("No CT body:", JSON.stringify(res.body, null, 2));
  });

  it("handles text/plain Content-Type", async () => {
    const res = await request(app)
      .post("/api/v1/auth/signup")
      .set("Content-Type", "text/plain")
      .send(JSON.stringify({
        name: "Text User",
        email: "text@example.com",
        phone: "6666666666",
        password: "password123",
      }));

    console.log("Text/plain status:", res.status);
    console.log("Text/plain body:", JSON.stringify(res.body, null, 2));
  });
});
