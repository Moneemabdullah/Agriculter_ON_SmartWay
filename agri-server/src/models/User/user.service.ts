import { User } from "./User.types";
import UserModel from "./user.models.js";

export const getAllUsersService = async (): Promise<User[]> => {
    return await UserModel.find();
};

export const getUserByIdService = async (id: string): Promise<User | null> => {
    return await UserModel.findById(id);
};

export const updatedUserByIdService = async (
    id: string,
    updateData: Partial<User>
): Promise<User | null> => {
    return await UserModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUserByIdService = async (
    id: string
): Promise<User | null> => {
    return await UserModel.findByIdAndDelete(id);
};
