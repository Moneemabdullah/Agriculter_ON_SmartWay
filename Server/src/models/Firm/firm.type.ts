import mongoose from "mongoose";
export interface Ifirm {
    location: {
        latitude: number;
        longitude: number;
    };
    crops: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    plantationDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
