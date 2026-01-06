import mongoose, { Schema, Model } from "mongoose";
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
    }
);

/**
 * Telemetry Model
 */
export const TelemetryModel: Model<ITelemetry> = mongoose.model<ITelemetry>(
    "Telemetry",
    TelemetrySchema
);
