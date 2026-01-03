import { CropModel } from "../crop/crope.model";
import { CropAlertEventModel } from "./cropAlertEvent.model";
import { sendTelegramAlert } from "../telegram/telegram.service";

interface TelemetryData {
    farmId: string;
    sensorId: string;
    cropId: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
}

export const evaluateCropAlerts = async (data: TelemetryData) => {
    const crop = await CropModel.findById(data.cropId);
    if (!crop) return;

    const checks = [
        {
            type: "temperature",
            value: data.temperature,
            range: crop.idealConditions.temperatureRange,
            emoji: "🌡️",
        },
        {
            type: "humidity",
            value: data.humidity,
            range: crop.idealConditions.humidityRange,
            emoji: "💧",
        },
        {
            type: "soilMoisture",
            value: data.soilMoisture,
            range: crop.idealConditions.soilmoistureRange,
            emoji: "🌱",
        },
    ];

    for (const check of checks) {
        if (check.value < check.range.min || check.value > check.range.max) {
            // store alert
            const alert = await CropAlertEventModel.create({
                farmId: data.farmId,
                sensorId: data.sensorId,
                cropId: data.cropId,
                cropName: crop.name,
                type: check.type,
                value: check.value,
                min: check.range.min,
                max: check.range.max,
            });

            // telegram message
            const message = `
${check.emoji} *Crop Alert*
🌾 Crop: ${crop.name}
📍 Farm: ${data.farmId}
📡 Sensor: ${data.sensorId}

🔎 ${check.type.toUpperCase()}
📉 Value: ${check.value}
✅ Ideal: ${check.range.min} - ${check.range.max}
`;

            await sendTelegramAlert(message);

            alert.notified = true;
            await alert.save();
        }
    }
};
