import { Router } from "express";
import { ingestTelemetry } from "./telemetry.controller";

const router = Router();

router.post("/ingest", ingestTelemetry);

export default router;
