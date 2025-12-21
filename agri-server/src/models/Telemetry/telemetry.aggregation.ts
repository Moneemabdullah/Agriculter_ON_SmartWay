import { TelemetryModel } from "./telemetry.model";

export const getMinuteAverage = async (sensorId: string) => {
    return TelemetryModel.aggregate([
        { $match: { sensorId } },
        {
            $group: {
                _id: {
                    $dateTrunc: {
                        date: "$createdAt",
                        unit: "minute",
                    },
                },
                avgTemperature: { $avg: "$temperature" },
                avgHumidity: { $avg: "$humidity" },
                avgSoilMoisture: { $avg: "$soilMoisture" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
};
