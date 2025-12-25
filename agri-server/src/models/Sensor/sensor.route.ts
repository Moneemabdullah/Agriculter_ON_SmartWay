import express from "express";
import {
    addSensorcontroller,
    deleteSensorByIdController,
    getSensorByIdController,
    getSensorsByOwnerController,
} from "./sensor.controller";

const router = express.Router();

// create sensor
router.post("/", addSensorcontroller);

// get sensor by sensorId
router.get("/id/:sensorId", getSensorByIdController);

// get sensors by ownerId
router.get("/owner/:ownerId", getSensorsByOwnerController);

// delete sensor
router.delete("/id/:sensorId", deleteSensorByIdController);

export default router;
