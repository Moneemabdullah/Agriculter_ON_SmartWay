import { TelemetryModel } from "./telemetry.model";
import { processAlerts } from "../alert/alert.service";

interface TelemetryPayload {
    sensorId: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
}

export const insertTelemetry = async (payload: any) => {
    const data = await TelemetryModel.create(payload);

    await processAlerts(payload); // includes crop alerts

    return data;
};
