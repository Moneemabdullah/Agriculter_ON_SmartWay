import logger from "../../utils/logger.utils";
import { AlertModel } from "./alert.model";

export const evaluateAlerts = async (data: {
    sensorId: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
}) => {
    const alerts = await AlertModel.find({ sensorId: data.sensorId });

    alerts.forEach((alert) => {
        const value = data[alert.type as keyof typeof data];

        // ensure value is a number
        if (typeof value !== "number") return;

        const min = alert.min ?? Number.NEGATIVE_INFINITY;
        const max = alert.max ?? Number.POSITIVE_INFINITY;

        if (value < min || value > max) {
            logger.error(
                `⚠ ALERT: ${alert.type} out of range for sensor ${data.sensorId}`
            );
        }
    });
};
