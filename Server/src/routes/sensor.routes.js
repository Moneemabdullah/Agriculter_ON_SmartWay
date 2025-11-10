const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensor.controller");

router.post("/input", sensorController.inputData);
router.get("/data", sensorController.getData);
router.get("/average/30days", sensorController.get30DayAverage);

module.exports = router;
