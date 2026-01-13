import { Request, Response, NextFunction } from "express";
import UserModel from "../User/user.models";
import { SensorModel } from "../Sensor/sensor.models";
import { TelemetryModel } from "../Telemetry/telemetry.model";

// Threshold in minutes to consider sensor online
const ONLINE_THRESHOLD_MINUTES = 15;

export const getAdminSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await UserModel.countDocuments();
    const totalSensors = await SensorModel.countDocuments();

    // Aggregate latest pulse per sensor
    const lastPulses = await TelemetryModel.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$sensorId",
          lastPulse: { $first: "$createdAt" },
        },
      },
    ]) as Array<{ _id: string; lastPulse: Date | string }>;

    const now = new Date();
    let onlineCount = 0;
    lastPulses.forEach((p) => {
      const last = new Date(p.lastPulse as string);
      const diffMinutes = (now.getTime() - last.getTime()) / 1000 / 60;
      if (diffMinutes <= ONLINE_THRESHOLD_MINUTES) onlineCount++;
    });

    const sensorsWithNoTelemetry = Math.max(0, totalSensors - lastPulses.length);
    // sensors with no telemetry are treated as offline
    const onlinePercent = totalSensors > 0 ? Math.round((onlineCount / totalSensors) * 100) : 0;

    // TODO: Replace with real balance logic when billing is added
    const totalBalance = 0;

    return res.json({
      success: true,
      data: {
        totalUsers,
        totalSensors,
        onlineCount,
        onlinePercent,
        totalBalance,
        sensorsWithNoTelemetry,
      },
    });
  } catch (err) {
    next(err);
  }
};