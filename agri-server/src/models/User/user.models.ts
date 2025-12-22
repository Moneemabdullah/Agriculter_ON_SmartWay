import { User } from "./User.types.js";
import mongoose, { Schema, Model } from "mongoose";

const userSchema: Schema<User> = new mongoose.Schema<User>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: {
            village: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

const UserModel: Model<User> = mongoose.model<User>("User", userSchema);

export default UserModel;
