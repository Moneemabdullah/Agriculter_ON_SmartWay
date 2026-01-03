import { Router } from "express";
import { getCropAlerts } from "./cropAlert.controller";

const router = Router();

router.get("/crop-alerts", getCropAlerts);

export default router;
