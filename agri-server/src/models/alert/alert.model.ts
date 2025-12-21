import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
    {
        sensorId: { type: String, required: true },
        type: {
            type: String,
            enum: ["temperature", "humidity", "soilMoisture"],
            required: true,
        },
        min: Number,
        max: Number,
    },
    { timestamps: true, versionKey: false }
);

export const AlertModel = mongoose.model("Alert", AlertSchema);
