import { ISensor } from "./sensor.types";
import { SensorModel } from "./sensor.models";

export const addSensorService = async (
    firmId: string,
    sensorId: string
): Promise<ISensor> => {
    const newSensor = new SensorModel({ firmId: firmId, sensorId });
    return await newSensor.save();
};

export const getSensorsByFirmService = async (
    firmId: string
): Promise<ISensor[]> => {
    return await SensorModel.find({ firmId: firmId });
};

export const getSensorByIdService = async (
    sensorId: string
): Promise<ISensor | null> => {
    return await SensorModel.findOne({ sensorId });
};

export const deleteSensorByIdService = async (
    sensorId: string
): Promise<ISensor | null> => {
    return await SensorModel.findOneAndDelete({ sensorId });
};
