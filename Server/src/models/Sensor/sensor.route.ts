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

// get sensors for current user
router.get("/", auth(), getSensorsByOwnerController);

// get sensor by sensorId
router.get("/id/:sensorId", auth(), getSensorByIdController);

// get sensors by ownerId (admin or same user)
router.get("/owner/:ownerId", auth(), getSensorsByOwnerController);

// delete sensor
router.delete("/id/:sensorId", auth("farmer"), deleteSensorByIdController);

export const SensorRouter = router;
