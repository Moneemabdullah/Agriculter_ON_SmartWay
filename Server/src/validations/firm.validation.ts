import { z } from "zod";

export const createFirmSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  crops: z.string().min(1, "Crop ID is required"),
  plantationDate: z.string().or(z.date()),
  photos: z.array(z.string().url()).optional(),
});

export const updateFirmSchema = z.object({
  location: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }).optional(),
  crops: z.string().min(1).optional(),
  plantationDate: z.string().or(z.date()).optional(),
  photos: z.array(z.string().url()).optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field must be provided",
});

export const addSensorToFirmSchema = z.object({
  sensorId: z.string().min(1, "Sensor ID is required"),
});

export type CreateFirmInput = z.infer<typeof createFirmSchema>;
export type UpdateFirmInput = z.infer<typeof updateFirmSchema>;
export type AddSensorToFirmInput = z.infer<typeof addSensorToFirmSchema>;
