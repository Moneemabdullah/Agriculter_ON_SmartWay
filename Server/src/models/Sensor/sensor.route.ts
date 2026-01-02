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
router.post("/", auth("farmer"), addSensorcontroller);

// get sensor by sensorId
router.get("/id/:sensorId", auth("farmer"), getSensorByIdController);

// get sensors by ownerId
router.get("/owner/:ownerId", auth("farmer"), getSensorsByOwnerController);

// delete sensor
router.delete("/id/:sensorId", auth("farmer"), deleteSensorByIdController);

export const SensorRouter = router;
