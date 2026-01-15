import mongoose from "mongoose";
import { Ifirm } from "./firm.type";

export const firmModelFields = new mongoose.Schema<Ifirm>(
    {
        location: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
        },
        photos: { type: [String] },
        crops: { type: mongoose.Types.ObjectId, ref: "Crop", required: true },
        owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        plantationDate: { type: Date, required: true },
        sensors: [
            {
                sensorId: { type: String, required: true },
                createdAt: { type: Date, default: Date.now },
                status: { type: String, default: "active" },
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
export const FirmModel = mongoose.model<Ifirm>("Firm", firmModelFields);
