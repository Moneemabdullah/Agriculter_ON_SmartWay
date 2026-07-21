import { z } from "zod";

const monthRangeSchema = z.object({
  startMonth: z.number().int().min(1).max(12),
  endMonth: z.number().int().min(1).max(12),
});

const rangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const createCropSchema = z.object({
  name: z.string().min(1, "Crop name is required").max(100),
  category: z.string().min(1, "Category is required").max(100),
  season: z.string().min(1, "Season is required").max(50),
  showingPeriod: monthRangeSchema,
  harvestPeriod: monthRangeSchema,
  idealConditions: z.object({
    temperatureRange: rangeSchema,
    humidityRange: rangeSchema,
    soilType: z.string().min(1, "Soil type is required"),
    soilmoistureRange: rangeSchema,
  }).optional(),
});

export const updateCropSchema = createCropSchema.partial();

export type CreateCropInput = z.infer<typeof createCropSchema>;
export type UpdateCropInput = z.infer<typeof updateCropSchema>;
