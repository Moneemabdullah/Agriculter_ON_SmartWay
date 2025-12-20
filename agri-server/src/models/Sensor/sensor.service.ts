import { ISensor } from "./sensor.types";
import { SensorModel } from "./sensor.models";

export const addSensorService = async (ownerId: string): Promise<ISensor> => {
    const sensorId = `sensor-${Date.now()}`;
    const newSensor = new SensorModel({ owner: ownerId, sensorId });
    return await newSensor.save();
};

export const getSensorsByOwnerService = async (
    ownerId: string
): Promise<ISensor[]> => {
    return await SensorModel.find({ owner: ownerId });
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
