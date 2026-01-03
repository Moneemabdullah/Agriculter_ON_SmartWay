import express from "express";
import auth from "../../middlewares/auth.middleware";
import {
    addSensorcontroller,
    deleteSensorByIdController,
    getSensorByIdController,
} from "./sensor.controller";

const router = express.Router();

// create sensor
router.post("/", auth("farmer"), (req, res, next) => {
    addSensorcontroller(req, res, next);
});

// get sensor by sensorId
router.get("/id/:sensorId", auth("farmer"), (req, res, next) => {
    getSensorByIdController(req, res, next);
});

// delete sensor
router.delete("/id/:sensorId", auth("farmer"), (req, res, next) => {
    deleteSensorByIdController(req, res, next);
});

export const SensorRouter = router;
