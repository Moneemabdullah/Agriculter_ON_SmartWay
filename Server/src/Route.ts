import { Router } from "express";
import { AuthRoutes } from "./models/Auth/auth.routes";
import { FirmRouter } from "./models/Firm/firm.route";
import { SensorRouter } from "./models/Sensor/sensor.route";
import { UserRoutes } from "./models/User/user.routes";
import { CropRouter } from "./models/crop/crop.routes";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/firms", FirmRouter);
router.use("/sensors", SensorRouter);
router.use("/users", UserRoutes);
router.use("/crops", CropRouter);

export const mainRouter = router;
