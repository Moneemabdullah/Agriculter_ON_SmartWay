import { telemetryPayloadSchema } from "./telemetry.validation";

describe("telemetryPayloadSchema", () => {
  const validRecord = {
    sensorId: "01",
    temperature: 25.5,
    humidity: 60.2,
    soilMoisture: 45.0,
  };

  it("accepts valid single record", () => {
    const result = telemetryPayloadSchema.safeParse(validRecord);
    expect(result.success).toBe(true);
  });

  it("accepts valid array of records", () => {
    const result = telemetryPayloadSchema.safeParse([validRecord, validRecord]);
    expect(result.success).toBe(true);
  });

  it("rejects missing sensorId", () => {
    const result = telemetryPayloadSchema.safeParse({
      temperature: 25,
      humidity: 60,
      soilMoisture: 45,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty sensorId", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      sensorId: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-number temperature", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      temperature: "hot",
    });
    expect(result.success).toBe(false);
  });

  it("rejects temperature above 100", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      temperature: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects temperature below -50", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      temperature: -51,
    });
    expect(result.success).toBe(false);
  });

  it("rejects humidity above 100", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      humidity: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative humidity", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      humidity: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects soilMoisture above 100", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      soilMoisture: 101,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative soilMoisture", () => {
    const result = telemetryPayloadSchema.safeParse({
      ...validRecord,
      soilMoisture: -1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty array", () => {
    const result = telemetryPayloadSchema.safeParse([]);
    expect(result.success).toBe(false);
  });

  it("rejects array with more than 50 items", () => {
    const bigArray = Array(51).fill(validRecord);
    const result = telemetryPayloadSchema.safeParse(bigArray);
    expect(result.success).toBe(false);
  });

  it("accepts boundary temperature values", () => {
    expect(
      telemetryPayloadSchema.safeParse({ ...validRecord, temperature: -50 })
        .success
    ).toBe(true);
    expect(
      telemetryPayloadSchema.safeParse({ ...validRecord, temperature: 100 })
        .success
    ).toBe(true);
  });

  it("accepts boundary humidity values", () => {
    expect(
      telemetryPayloadSchema.safeParse({ ...validRecord, humidity: 0 }).success
    ).toBe(true);
    expect(
      telemetryPayloadSchema.safeParse({ ...validRecord, humidity: 100 })
        .success
    ).toBe(true);
  });
});
