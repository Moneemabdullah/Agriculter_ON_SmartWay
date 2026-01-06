import { Request, Response } from "express";
import { CropAlertEventModel } from "./cropAlertEvent.model";

/**
 * GET crop alert events
 */
export const getCropAlerts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { farmId, sensorId, cropId } = req.query;

        const filter: Record<string, string> = {};

        if (typeof farmId === "string") {
            filter.farmId = farmId;
        }

        if (typeof sensorId === "string") {
            filter.sensorId = sensorId;
        }

        if (typeof cropId === "string") {
            filter.cropId = cropId;
        }

        const alerts = await CropAlertEventModel.find(filter)
            .sort({ triggeredAt: -1 })
            .limit(200)
            .lean();

        res.status(200).json({
            success: true,
            data: alerts,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: "Failed to fetch crop alerts",
        });
    }
};
