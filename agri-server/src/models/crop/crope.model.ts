import mongoose from "mongoose";
import { Crop } from "./crop.@types";
const { Schema, model } = mongoose;

export const CropSchema = new Schema<Crop>(
    {
        name: { type: String, required: true },
        caregory: { type: String, required: true },
        season: { type: String, required: true },
        showingPeriod: {
            startMonth: { type: Number, required: true },
            endMonth: { type: Number, required: true },
        },
        harvestPeriod: {
            startMonth: { type: Number, required: true },
            endMonth: { type: Number, required: true },
        },
        idealConditions: {
            temperatureRange: {
                min: { type: Number, required: true },
                max: { type: Number, required: true },
            },
            humidityRange: {
                min: { type: Number, required: true },
                max: { type: Number, required: true },
            },
            soilType: { type: String, required: true },
            soilmoistureRange: {
                min: { type: Number, required: true },
                max: { type: Number, required: true },
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const CropModel = model<Crop>("Crop", CropSchema);
