import { Request, Response } from "express";
import { getSensorAnalytics } from "./analytics.service";

export const getAnalytics = async (req: Request, res: Response) => {
    const { sensorId } = req.params;

    const data = await getSensorAnalytics(sensorId as string);

    res.json({
        success: true,
        data,
    });
};
