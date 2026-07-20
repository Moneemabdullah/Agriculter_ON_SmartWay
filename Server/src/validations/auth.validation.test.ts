import { signupSchema, signinSchema } from "./auth.validation";

describe("signupSchema", () => {
  const validSignup = {
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password: "secret123",
  };

  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
  });

  it("strips unknown fields including role", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      role: "admin",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("role");
    }
  });

  it("strips viewer role injection", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      role: "viewer",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("role");
    }
  });

  it("rejects missing name", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      name: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      email: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing phone", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      phone: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      name: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("signinSchema", () => {
  const validSignin = {
    identifier: "john@example.com",
    password: "secret123",
  };

  it("accepts valid signin data", () => {
    const result = signinSchema.safeParse(validSignin);
    expect(result.success).toBe(true);
  });

  it("rejects missing identifier", () => {
    const result = signinSchema.safeParse({
      ...validSignin,
      identifier: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing password", () => {
    const result = signinSchema.safeParse({
      ...validSignin,
      password: undefined,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty identifier", () => {
    const result = signinSchema.safeParse({
      ...validSignin,
      identifier: "",
    });
    expect(result.success).toBe(false);
  });
});
