const SensorData = require("../models/sensorData.models");
const DailyAverage = require("../models/dailyAverage.model");



exports.inputData = async (req, res) => {
  try {
    const { sensorId, temperature, humidity, soilMoisture } = req.body;

    if (!sensorId || temperature == null || humidity == null || soilMoisture == null) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const newSensorData = new SensorData({
      sensorId,
      temperature,
      humidity,
      soilMoisture,
      timestamp: new Date(),
    });

    await newSensorData.save();

    res.status(201).json({ msg: "✅ Sensor data recorded successfully" });
  } catch (err) {
    console.error("Error saving sensor data:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};


exports.getData = async (req, res) => {
  try {
    const { sensorId, startTime, endTime } = req.query;

    const query = {};
    if (sensorId) query.sensorId = sensorId;
    if (startTime || endTime) query.timestamp = {};
    if (startTime) query.timestamp.$gte = new Date(startTime);
    if (endTime) query.timestamp.$lte = new Date(endTime);

    const data = await SensorData.find(query).sort({ timestamp: -1 });

    res.status(200).json(data);
  } catch (err) {
    console.error("Error retrieving data:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};

exports.calculateDailyAverage = async () => {
  try {
    const today = new Date();
    const start = new Date(today.setHours(0, 0, 0, 0));
    const end = new Date(today.setHours(23, 59, 59, 999));

    const aggregation = await SensorData.aggregate([
      {
        $match: {
          timestamp: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$sensorId",
          avgTemperature: { $avg: "$temperature" },
          avgHumidity: { $avg: "$humidity" },
          avgSoilMoisture: { $avg: "$soilMoisture" },
        },
      },
    ]);

    for (const record of aggregation) {
      await DailyAverage.findOneAndUpdate(
        { sensorId: record._id, date: start },
        {
          sensorId: record._id,
          date: start,
          avgTemperature: record.avgTemperature,
          avgHumidity: record.avgHumidity,
          avgSoilMoisture: record.avgSoilMoisture,
        },
        { upsert: true, new: true }
      );
    }

    console.log("✅ Daily averages updated successfully");
  } catch (err) {
    console.error("Error calculating daily averages:", err.message);
  }
};

exports.get30DayAverage = async (req, res) => {
  try {
    const { sensorId } = req.query;
    if (!sensorId) {
      return res.status(400).json({ msg: "sensorId is required" });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const result = await DailyAverage.aggregate([
      { $match: { sensorId, date: { $gte: startDate } } },
      {
        $group: {
          _id: "$sensorId",
          avgTemperature: { $avg: "$avgTemperature" },
          avgHumidity: { $avg: "$avgHumidity" },
          avgSoilMoisture: { $avg: "$avgSoilMoisture" },
        },
      },
    ]);

    if (result.length === 0)
      return res.status(404).json({ msg: "No data found for last 30 days" });

    res.status(200).json(result[0]);
  } catch (err) {
    console.error("Error fetching 30-day averages:", err.message);
    res.status(500).json({ msg: "Server Error", error: err.message });
  }
};
