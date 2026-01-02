import { evaluateAlerts } from "./alert.engine";

export const processAlerts = async (telemetryData: any) => {
    await evaluateAlerts(telemetryData);
};
