export interface ITelemetry {
    sensorId: string;
    temperature: number;
    humidity: number;
    soilMoisture: number;
    createdAt?: Date;
    updatedAt?: Date;
}
