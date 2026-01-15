import mongoose from "mongoose";

export interface ISensor {
    sensorId: string;
    createdAt: Date;
    status?: string;
}

export interface Ifirm {
    location: {
        latitude: number;
        longitude: number;
    };
    photos?: string[];
    crops: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    plantationDate: Date;
    sensors?: ISensor[];
    createdAt: Date;
    updatedAt: Date;
}
