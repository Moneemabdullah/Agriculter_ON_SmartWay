import { z } from "zod";

export const telemetrySchema = z.object({
    sensorId: z.string(),
    temperature: z.number(),
    humidity: z.number(),
    soilMoisture: z.number(),
});
