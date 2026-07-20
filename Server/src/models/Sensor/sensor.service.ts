import { ISensor } from "./sensor.types";
import { SensorModel } from "./sensor.models";
import { FirmModel } from "../Firm/firm.models";

export type UserContext = {
    userId: string;
    role: "admin" | "farmer" | "viewer";
};

async function verifySensorOwnership(
    sensorId: string,
    userContext: UserContext
): Promise<boolean> {
    if (userContext.role === "admin") return true;

    const sensor = await SensorModel.findOne({ sensorId });
    if (!sensor) return false;

    const firm = await FirmModel.findById(sensor.firmId);
    if (!firm) return false;

    return firm.owner.toString() === userContext.userId;
}

export const addSensorService = async (
    firmId: string,
    sensorId: string
): Promise<ISensor> => {
    const newSensor = new SensorModel({ firmId: firmId, sensorId });
    return await newSensor.save();
};

export const getAllSensorsService = async (): Promise<ISensor[]> => {
    return await SensorModel.find({});
};

export const getSensorsByFirmService = async (
    firmId: string
): Promise<ISensor[]> => {
    return await SensorModel.find({ firmId: firmId });
};

export const getSensorsByFirmIdsService = async (
    firmIds: string[]
): Promise<ISensor[]> => {
    return await SensorModel.find({ firmId: { $in: firmIds } });
};

export const getSensorByIdService = async (
    sensorId: string,
    userContext?: UserContext
): Promise<ISensor | null> => {
    const sensor = await SensorModel.findOne({ sensorId });
    if (!sensor) return null;

    if (!userContext) return sensor;

    if (userContext.role === "admin") return sensor;

    const firm = await FirmModel.findById(sensor.firmId);
    if (!firm) return null;
    if (firm.owner.toString() !== userContext.userId) return null;

    return sensor;
};

export const deleteSensorByIdService = async (
    sensorId: string,
    userContext?: UserContext
): Promise<ISensor | null> => {
    if (userContext) {
        const authorized = await verifySensorOwnership(sensorId, userContext);
        if (!authorized) return null;
    }

    return await SensorModel.findOneAndDelete({ sensorId });
};

export { verifySensorOwnership };
