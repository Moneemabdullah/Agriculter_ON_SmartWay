import { Request, Response } from "express";
import { CropAlertEventModel } from "./cropAlertEvent.model";

export const getCropAlerts = async (req: Request, res: Response) => {
    const { farmId, sensorId, cropId } = req.query;

    const filter: any = {};
    if (farmId) filter.farmId = farmId;
    if (sensorId) filter.sensorId = sensorId;
    if (cropId) filter.cropId = cropId;

    const alerts = await CropAlertEventModel.find(filter)
        .sort({ triggeredAt: -1 })
        .limit(200);

    res.json({
        success: true,
        data: alerts,
    });
};
