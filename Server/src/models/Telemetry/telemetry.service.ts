import { TelemetryModel } from "./telemetry.model";
import { processAlerts } from "../alert/alert.service";

export interface TelemetryPayload {
    sensorId: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
}

export const insertTelemetry = async (
    payload: TelemetryPayload | TelemetryPayload[]
) => {
    const payloads = Array.isArray(payload) ? payload : [payload];

    const data = await TelemetryModel.insertMany(payloads);

    await Promise.all(payloads.map((item) => processAlerts(item)));

    return data;
};
