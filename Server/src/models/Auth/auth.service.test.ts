import bcrypt from "bcrypt";
import UserModel from "../User/user.models";
import {
    signUpService,
    signInService,
    changePasswordService,
    getUserById,
} from "./auth.service";

jest.mock("../User/user.models");

const mockedUserModel = jest.mocked(UserModel);

describe("signUpService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("always assigns 'farmer' role regardless of input", async () => {
    const mockUser = {
      toObject: () => ({
        _id: "user123",
        name: "John",
        email: "john@test.com",
        phone: "123",
        role: "farmer",
        password: "hashed",
      }),
    };
    mockedUserModel.create.mockResolvedValue(mockUser as never);

    await signUpService({
      name: "John",
      email: "john@test.com",
      phone: "123",
      password: "password123",
      role: "admin",
    } as never);

    expect(mockedUserModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "farmer",
      })
    );
  });

  it("assigns 'farmer' role when no role is provided", async () => {
    const mockUser = {
      toObject: () => ({
        _id: "user123",
        name: "John",
        email: "john@test.com",
        phone: "123",
        role: "farmer",
        password: "hashed",
      }),
    };
    mockedUserModel.create.mockResolvedValue(mockUser as never);

    await signUpService({
      name: "John",
      email: "john@test.com",
      phone: "123",
      password: "password123",
    });

    expect(mockedUserModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        role: "farmer",
      })
    );
  });

  it("does not include client-supplied role in create call", async () => {
    const mockUser = {
      toObject: () => ({
        _id: "user123",
        name: "John",
        email: "john@test.com",
        phone: "123",
        role: "farmer",
        password: "hashed",
      }),
    };
    mockedUserModel.create.mockResolvedValue(mockUser as never);

    await signUpService({
      name: "John",
      email: "john@test.com",
      phone: "123",
      password: "password123",
      role: "viewer",
    } as never);

    const createArg = mockedUserModel.create.mock.calls[0]![0] as Record<
      string,
      unknown
    >;
    expect(createArg["role"]).toBe("farmer");
    expect(createArg).not.toHaveProperty("viewer");
  });

  it("hashes the password with bcrypt", async () => {
    const mockUser = {
      toObject: () => ({
        _id: "user123",
        name: "John",
        email: "john@test.com",
        phone: "123",
        role: "farmer",
        password: "hashed",
      }),
    };
    mockedUserModel.create.mockResolvedValue(mockUser as never);

    await signUpService({
      name: "John",
      email: "john@test.com",
      phone: "123",
      password: "password123",
    });

    const createCall = mockedUserModel.create.mock.calls[0]![0] as Record<
      string,
      unknown
    >;
    const hashedPassword = createCall["password"] as string;
    expect(hashedPassword).not.toBe("password123");
    const isValid = await bcrypt.compare("password123", hashedPassword);
    expect(isValid).toBe(true);
  });

  it("returns user without password field", async () => {
    const mockUser = {
      toObject: () => ({
        _id: "user123",
        name: "John",
        email: "john@test.com",
        phone: "123",
        role: "farmer",
        password: "hashed",
      }),
    };
    mockedUserModel.create.mockResolvedValue(mockUser as never);

    const result = await signUpService({
      name: "John",
      email: "john@test.com",
      phone: "123",
      password: "password123",
    });

    expect(result).not.toHaveProperty("password");
    expect(result).toHaveProperty("id", "user123");
  });

  it("rejects duplicate email", async () => {
    mockedUserModel.create.mockRejectedValue(
      new Error("E11000 duplicate key error")
    );

    await expect(
      signUpService({
        name: "John",
        email: "john@test.com",
        phone: "123",
        password: "password123",
      })
    ).rejects.toThrow("E11000");
  });
});

describe("signInService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns token for valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    const mockUser = {
      _id: { toString: () => "user123" },
      name: "John",
      email: "john@test.com",
      phone: "123",
      password: hashedPassword,
      role: "farmer",
    };
    mockedUserModel.findOne.mockResolvedValue(mockUser as never);

    const result = await signInService("john@test.com", "password123");

    expect(result).toHaveProperty("token");
    expect(result.user).toHaveProperty("id", "user123");
    expect(result.user).not.toHaveProperty("password");
  });

  it("rejects invalid password", async () => {
    const hashedPassword = await bcrypt.hash("correctpassword", 10);
    const mockUser = {
      _id: { toString: () => "user123" },
      name: "John",
      email: "john@test.com",
      phone: "123",
      password: hashedPassword,
      role: "farmer",
    };
    mockedUserModel.findOne.mockResolvedValue(mockUser as never);

    await expect(
      signInService("john@test.com", "wrongpassword")
    ).rejects.toThrow("Invalid password");
  });

  it("rejects non-existent user", async () => {
    mockedUserModel.findOne.mockResolvedValue(null);

    await expect(
      signInService("nobody@test.com", "password123")
    ).rejects.toThrow("User not found");
  });

  it("rejects empty identifier", async () => {
    await expect(signInService("", "password123")).rejects.toThrow(
      "Identifier and password are required"
    );
  });

  it("rejects empty password", async () => {
    await expect(signInService("john@test.com", "")).rejects.toThrow(
      "Identifier and password are required"
    );
  });
});

describe("changePasswordService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates password for valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("oldpassword", 10);
    const mockUser = {
      email: "john@test.com",
      password: hashedPassword,
      save: jest.fn(),
    };
    mockedUserModel.findOne.mockResolvedValue(mockUser as never);

    await changePasswordService("john@test.com", "oldpassword", "newpassword");

    expect(mockUser.save).toHaveBeenCalled();
    const newHash = mockUser.password;
    const isValid = await bcrypt.compare("newpassword", newHash);
    expect(isValid).toBe(true);
  });

  it("rejects non-existent user", async () => {
    mockedUserModel.findOne.mockResolvedValue(null);

    await expect(
      changePasswordService("nobody@test.com", "old", "new")
    ).rejects.toThrow("User not found");
  });

  it("rejects wrong current password", async () => {
    const hashedPassword = await bcrypt.hash("correctpassword", 10);
    const mockUser = {
      email: "john@test.com",
      password: hashedPassword,
      save: jest.fn(),
    };
    mockedUserModel.findOne.mockResolvedValue(mockUser as never);

    await expect(
      changePasswordService("john@test.com", "wrongpassword", "newpassword")
    ).rejects.toThrow("Invalid current password");
  });
});

describe("getUserById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns user without password", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue({
        _id: "user123",
        name: "John",
        email: "john@test.com",
        phone: "123",
        role: "farmer",
      }),
    };
    mockedUserModel.findById.mockReturnValue(mockQuery as never);

    const result = await getUserById("user123");

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("id", "user123");
    expect(result).not.toHaveProperty("password");
  });

  it("returns null for non-existent user", async () => {
    const mockQuery = {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue(null),
    };
    mockedUserModel.findById.mockReturnValue(mockQuery as never);

    const result = await getUserById("nonexistent");

    expect(result).toBeNull();
  });
});
