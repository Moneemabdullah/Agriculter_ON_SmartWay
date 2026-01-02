import mongoose from "mongoose";
export interface Ifirm {
    location: string;
    crops: mongoose.Types.ObjectId;
    sensors: mongoose.Types.ObjectId[];
    user: mongoose.Types.ObjectId;
    plantationDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
