import mongoose from "mongoose";
import { Ifirm } from "./firm.type";

export const firmModelFields = new mongoose.Schema<Ifirm>(
    {
        location: { type: String, required: true },
        crops: { type: mongoose.Types.ObjectId, ref: "Crop", required: true },
        sensors: [
            { type: mongoose.Types.ObjectId, ref: "Sensor", required: true },
        ],
        user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        plantationDate: { type: Date, required: true },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
export const FirmModel = mongoose.model<Ifirm>("Firm", firmModelFields);
