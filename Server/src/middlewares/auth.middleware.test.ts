import jwt from "jsonwebtoken";
import UserModel from "../models/User/user.models";
import config from "../config/env.config";
import auth from "./auth.middleware";

jest.mock("../models/User/user.models");

const mockedUserModel = jest.mocked(UserModel);

function createToken(payload: { userId: string; role?: string }) {
    return jwt.sign(payload, config.jwtSecret as string, { expiresIn: "1h" });
}

describe("auth middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("rejects missing authorization header", async () => {
        const middleware = auth();
        const req = { headers: {} } as any;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const next = jest.fn();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects invalid token", async () => {
        const middleware = auth();
        const req = {
            headers: { authorization: "Bearer invalidtoken" },
        } as any;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const next = jest.fn();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects banned user", async () => {
        const token = createToken({ userId: "user1", role: "farmer" });
        mockedUserModel.findById.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue({
                role: "farmer",
                isBanned: true,
            }),
        } as any);

        const middleware = auth();
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as any;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const next = jest.fn();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Your account has been banned",
            error: { code: "FORBIDDEN" },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it("allows non-banned user", async () => {
        const token = createToken({ userId: "user1", role: "farmer" });
        mockedUserModel.findById.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue({
                role: "farmer",
                isBanned: false,
            }),
        } as any);

        const middleware = auth();
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as any;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const next = jest.fn();

        await middleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
        expect(req.userId).toBe("user1");
    });

    it("rejects user with wrong role", async () => {
        const token = createToken({ userId: "user1", role: "farmer" });
        mockedUserModel.findById.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue({
                role: "farmer",
                isBanned: false,
            }),
        } as any);

        const middleware = auth("admin");
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as any;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const next = jest.fn();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it("rejects non-existent user", async () => {
        const token = createToken({ userId: "nonexistent", role: "farmer" });
        mockedUserModel.findById.mockReturnValue({
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(null),
        } as any);

        const middleware = auth();
        const req = {
            headers: { authorization: `Bearer ${token}` },
        } as any;
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;
        const next = jest.fn();

        await middleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
