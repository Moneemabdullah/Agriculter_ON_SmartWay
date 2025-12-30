import express from "express";
import {
    addSensorcontroller,
    deleteSensorByIdController,
    getSensorByIdController,
    getSensorsByOwnerController,
} from "./sensor.controller";
import auth from "../../middlewares/auth.middleware";

const router = express.Router();

// create sensor
router.post("/", auth("user"), addSensorcontroller);

// get sensor by sensorId
router.get("/id/:sensorId", auth("user"), getSensorByIdController);

// get sensors by ownerId
router.get("/owner/:ownerId", auth("user"), getSensorsByOwnerController);

// delete sensor
router.delete("/id/:sensorId", auth("user"), deleteSensorByIdController);

export const SensorRouter = router;
