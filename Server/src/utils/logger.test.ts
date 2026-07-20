import { sanitizeLogBody } from "./logger.utils";

describe("sanitizeLogBody", () => {
    it("redacts 'password' field", () => {
        const input = { name: "John", password: "secret123" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.password).toBe("[REDACTED]");
        expect(result.name).toBe("John");
    });

    it("redacts 'token' field", () => {
        const input = { token: "eyJhbGci..." };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.token).toBe("[REDACTED]");
    });

    it("redacts 'refreshToken' field", () => {
        const input = { refreshToken: "abc123" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.refreshToken).toBe("[REDACTED]");
    });

    it("redacts 'newPassword' field", () => {
        const input = { newPassword: "newsecret" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.newPassword).toBe("[REDACTED]");
    });

    it("redacts 'currentPassword' field", () => {
        const input = { currentPassword: "oldsecret" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.currentPassword).toBe("[REDACTED]");
    });

    it("redacts case-insensitive matches", () => {
        const input = { PASSWORD: "secret", Token: "abc" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.PASSWORD).toBe("[REDACTED]");
        expect(result.Token).toBe("[REDACTED]");
    });

    it("preserves non-sensitive fields", () => {
        const input = { name: "John", email: "john@example.com", age: 30 };
        const result = sanitizeLogBody(input);
        expect(result).toEqual(input);
    });

    it("handles nested objects", () => {
        const input = { user: { name: "John", password: "secret" } };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        const user = result.user as Record<string, unknown>;
        expect(user.name).toBe("John");
        expect(user.password).toBe("[REDACTED]");
    });

    it("handles arrays", () => {
        const input = [{ password: "a" }, { password: "b" }];
        const result = sanitizeLogBody(input) as Array<Record<string, unknown>>;
        expect(result[0]!.password).toBe("[REDACTED]");
        expect(result[1]!.password).toBe("[REDACTED]");
    });

    it("returns null as-is", () => {
        expect(sanitizeLogBody(null)).toBeNull();
    });

    it("returns undefined as-is", () => {
        expect(sanitizeLogBody(undefined)).toBeUndefined();
    });

    it("returns primitives as-is", () => {
        expect(sanitizeLogBody("string")).toBe("string");
        expect(sanitizeLogBody(42)).toBe(42);
    });

    it("does not mutate original object", () => {
        const input = { password: "secret", name: "John" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(input.password).toBe("secret");
        expect(result.password).toBe("[REDACTED]");
    });

    it("redacts 'authorization' field", () => {
        const input = { authorization: "Bearer token123" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.authorization).toBe("[REDACTED]");
    });

    it("redacts 'apiKey' field", () => {
        const input = { apiKey: "key123" };
        const result = sanitizeLogBody(input) as Record<string, unknown>;
        expect(result.apiKey).toBe("[REDACTED]");
    });
});
