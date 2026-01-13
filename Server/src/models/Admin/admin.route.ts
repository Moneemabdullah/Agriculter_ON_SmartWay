import express from "express";
import auth from "../../middlewares/auth.middleware";
import { getAdminSummary } from "./admin.controller";

const router = express.Router();

// Get admin summary metrics
router.get("/summary", auth("admin"), getAdminSummary);

export const AdminRouter = router;
