import mongoose, { Schema, Document } from "mongoose";

export interface ICropAlertEvent extends Document {
    farmId: string;
    sensorId: string;
    cropId: string;
    cropName: string;

    type: "temperature" | "humidity" | "soilMoisture";

    value: number;
    min: number;
    max: number;

    triggeredAt: Date;
    notified: boolean;
}

const CropAlertEventSchema = new Schema<ICropAlertEvent>(
    {
        farmId: {
            type: String,
            required: true,
            index: true,
        },
        sensorId: {
            type: String,
            required: true,
            index: true,
        },
        cropId: {
            type: String,
            required: true,
            index: true,
        },
        cropName: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["temperature", "humidity", "soilMoisture"],
            required: true,
            index: true,
        },
        value: {
            type: Number,
            required: true,
        },
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
        triggeredAt: {
            type: Date,
            default: Date.now,
            index: true,
        },
        notified: {
            type: Boolean,
            default: false,
        },
    },
    {
        versionKey: false,
    }
);

export const CropAlertEventModel = mongoose.model<ICropAlertEvent>(
    "CropAlertEvent",
    CropAlertEventSchema
);
