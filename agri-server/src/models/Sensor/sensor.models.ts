import mongoose, { Types } from "mongoose";
import { ISensor } from "./sensor.types";

const { Schema, model } = mongoose;

const SensorSchema = new Schema<ISensor>(
    {
        owner: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        sensorId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const SensorModel = model<ISensor>("Sensor", SensorSchema);

export { SensorModel };
