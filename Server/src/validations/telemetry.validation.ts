import { z } from "zod";

const telemetryRecordSchema = z.object({
  sensorId: z.string().min(1, "sensorId is required"),
  temperature: z
    .number()
    .min(-50, "Temperature below -50 is invalid")
    .max(100, "Temperature above 100 is invalid"),
  humidity: z
    .number()
    .min(0, "Humidity cannot be negative")
    .max(100, "Humidity cannot exceed 100"),
  soilMoisture: z
    .number()
    .min(0, "Soil moisture cannot be negative")
    .max(100, "Soil moisture cannot exceed 100"),
});

export const telemetryPayloadSchema = z.union([
  telemetryRecordSchema,
  z
    .array(telemetryRecordSchema)
    .min(1, "Array must not be empty")
    .max(50, "Array too large"),
]);

export const sensorSchema = z.object({
  sensorId: z.string().min(1, "sensorId is required"),
  firmId: z.string().min(1, "firmId is required"),
});

export type TelemetryRecord = z.infer<typeof telemetryRecordSchema>;
export type TelemetryPayloadInput = z.infer<typeof telemetryPayloadSchema>;
