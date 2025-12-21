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

        if (
            (alert.min !== undefined && value < alert.min) ||
            (alert.max !== undefined && value > alert.max)
        ) {
            console.log(
                `⚠ ALERT: ${alert.type} out of range for sensor ${data.sensorId}`
            );
        }
    });
};
