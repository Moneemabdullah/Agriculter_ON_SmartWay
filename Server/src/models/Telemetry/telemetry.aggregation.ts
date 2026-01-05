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

export const getHourAverageForDay = async (sensorId: string, date: Date) => {
    const startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
    const endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + 1
    );
    return TelemetryModel.aggregate([
        {
            $match: {
                sensorId,
                createdAt: { $gte: startOfDay, $lt: endOfDay },
            },
        },
        {
            $group: {
                _id: {
                    $dateTrunc: {
                        date: "$createdAt",
                        unit: "hour",
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
export const getDayAverageForWeek = async (sensorId: string) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    return TelemetryModel.aggregate([
        {
            $match: {
                sensorId,
                createdAt: { $gte: start, $lte: end },
            },
        },
        {
            $group: {
                _id: {
                    $dateTrunc: {
                        date: "$createdAt",
                        unit: "day",
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
