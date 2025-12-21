import { TelemetryModel } from "./telemetry.model";

interface TelemetryPayload {
    sensorId: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
}

export const insertTelemetry = async (
    payload: TelemetryPayload | TelemetryPayload[]
) => {
    if (Array.isArray(payload)) {
        return TelemetryModel.insertMany(payload, { ordered: false });
    }
    return TelemetryModel.create(payload);
};
