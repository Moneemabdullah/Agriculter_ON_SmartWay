import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "../../config/env.config.ts";
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

export const signInService = async (phone: string, password: string) => {
    if (!phone || !password) {
        throw new Error("Phone and password are required");
    }

    const user = await UserModel.findOne({ phone }).lean();

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

    const { password: _, ...safeUser } = user;

    return {
        token,
        user: {
            id: user._id.toString(),
        },
    };
};
