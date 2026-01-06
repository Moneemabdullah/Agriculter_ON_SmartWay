import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/env.config";
import UserModel from "../User/user.models";
import { CreateUser, PublicUser, User } from "../User/User.types";

const SALT_ROUNDS = 10;

/* ===================== SIGN UP ===================== */
export const signUpService = async (user: CreateUser): Promise<PublicUser> => {
    // 🔐 hash password
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    // 🧠 default role
    const role = user.role ?? "farmer";

    // 💾 save to DB
    const createdUser = await UserModel.create({
        ...user,
        role,
        password: hashedPassword,
    });

    // 🧼 remove sensitive fields
    const userObj = createdUser.toObject();
    const { _id, ...safeUser } = userObj;

    return {
        ...safeUser,
        id: _id.toString(),
    };
};

/* ===================== SIGN IN ===================== */
export const signInService = async (identifier: string, password: string) => {
    if (!identifier || !password) {
        throw new Error("Identifier and password are required");
    }

    // allow login by phone OR email
    const user = await UserModel.findOne({
        $or: [{ phone: identifier }, { email: identifier }],
    });

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role ?? "farmer",
        },
        config.jwtSecret as string,
        { expiresIn: "1d" }
    );

    return {
        token,
        user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            address: user.address,
            photo: user.photo,
        },
    };
};

/* ===================== GET USER ===================== */
export const getUserById = async (id: string): Promise<PublicUser | null> => {
    const user = await UserModel.findById(id)
        .select("-password")
        .lean<User & { _id: string }>();

    if (!user) return null;

    const { _id, ...rest } = user;

    return {
        ...rest,
        id: _id.toString(),
    };
};
