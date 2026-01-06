import { ITelemetry } from "../Telemetry/telemetry.types";
import { evaluateAlerts } from "./alert.engine";

export const processAlerts = async (telemetryData: ITelemetry) => {
    await evaluateAlerts(telemetryData);
};
