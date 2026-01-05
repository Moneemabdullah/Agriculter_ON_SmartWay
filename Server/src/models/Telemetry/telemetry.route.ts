import { Router } from "express";
import { ingestTelemetry } from "./telemetry.controller";
import {
    getDayAverageForWeekController,
    getHourAverageForDayController,
} from "./telemetry.controller";

const router = Router();

router.post("/ingest", (req, res, next) => {
    ingestTelemetry(req, res, next);
});

router.post("/ingest/bulk", (req, res, next) => {
    ingestTelemetry(req, res, next);
});

router.get("/average/hour/:sensorId/:date", (req, res, next) => {
    getHourAverageForDayController(req, res, next);
});

router.get("/average/day/:sensorId/week", (req, res, next) => {
    getDayAverageForWeekController(req, res, next);
});

export const TelemetryRouter = router;
