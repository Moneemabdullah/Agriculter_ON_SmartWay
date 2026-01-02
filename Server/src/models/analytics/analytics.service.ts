import { getMinuteAverage } from "../Telemetry/telemetry.aggregation";

export const getSensorAnalytics = async (sensorId: string) => {
    return getMinuteAverage(sensorId);
};
