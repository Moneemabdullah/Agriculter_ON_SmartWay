const mongoose = require("mongoose");

const sensorDataSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    humidity: {
      type: Number,
      required: true,
    },
    soilMoisture: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SensorData", sensorDataSchema);
