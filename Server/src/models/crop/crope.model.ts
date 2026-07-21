import mongoose from "mongoose";
import { Crop } from "./crop.@types";
const { Schema, model } = mongoose;

export const CropSchema = new Schema<Crop>(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
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
                min: { type: Number },
                max: { type: Number },
            },
            humidityRange: {
                min: { type: Number },
                max: { type: Number },
            },
            soilType: { type: String },
            soilmoistureRange: {
                min: { type: Number },
                max: { type: Number },
            },
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export const CropModel = model<Crop>("Crop", CropSchema);
