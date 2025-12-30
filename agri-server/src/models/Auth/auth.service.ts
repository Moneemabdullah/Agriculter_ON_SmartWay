import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/env.config";
import jwt from "jsonwebtoken";
import UserModel from "../User/user.models";
import { CreateUser, PublicUser } from "../User/User.types";

const SALT_ROUNDS = 10;

export const signUpService = async (user: CreateUser): Promise<PublicUser> => {
    // hash password
    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

    // save to DB
    const createdUser = await UserModel.create({
        ...user,
        password: hashedPassword,
    });

    // remove password before returning
    const { password, _id, ...safeUser } = createdUser.toObject();

    return {
        ...safeUser,
        id: _id.toString(),
    };
};

export const signInService = async (identifier: string, password: string) => {
    if (!identifier || !password) {
        throw new Error("Identifier and password are required");
    }

    // allow login by phone OR email
    const user = await UserModel.findOne({
        $or: [{ phone: identifier }, { email: identifier }],
    }).lean();

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid password");
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret as string, {
        expiresIn: "1d",
    });

    // Return token and id
    return {
        token,
        user: {
            id: user._id.toString(),
        },
    };
};

export const getUserById = async (id: string) => {
    const user = await UserModel.findById(id).select("-password").lean();
    if (!user) return null;
    const { _id, ...rest } = user as any;
    return { id: _id.toString(), ...rest };
};
