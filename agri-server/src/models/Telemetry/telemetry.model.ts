import mongoose, { Schema } from "mongoose";
import { ITelemetry } from "./telemetry.types";

const TelemetrySchema = new Schema<ITelemetry>(
    {
        sensorId: {
            type: String,
            required: true,
            index: true,
        },
        temperature: {
            type: Number,
            required: true,
        },
        humidity: {
            type: Number,
            required: true,
        },
        soilMoisture: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
        timeseries: {
            timeField: "createdAt",
            granularity: "seconds",
        },
    } as any // 👈 TS limitation
);

export const TelemetryModel = mongoose.model<ITelemetry>(
    "Telemetry",
    TelemetrySchema
);
