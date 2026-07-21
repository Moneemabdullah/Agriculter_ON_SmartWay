import { z } from "zod";

export const createSensorSchema = z.object({
  sensorId: z.string().min(1, "Sensor ID is required"),
  firmId: z.string().min(1, "Firm ID is required").optional(),
});

export type CreateSensorInput = z.infer<typeof createSensorSchema>;
