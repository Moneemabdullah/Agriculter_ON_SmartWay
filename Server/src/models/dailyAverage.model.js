const mongoose = require("mongoose");

const dailyAverageSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      unique: false,
    },
    avgTemperature: Number,
    avgHumidity: Number,
    avgSoilMoisture: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("DailyAverage", dailyAverageSchema);
