import { Router } from "express";
import { ingestTelemetry } from "./telemetry.controller";

const router = Router();

router.post("/ingest", (req, res, next) => {
    ingestTelemetry(req, res, next);
});

export const TelemetryRouter = router;
