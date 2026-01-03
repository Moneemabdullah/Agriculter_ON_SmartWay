import { FirmModel } from "./firm.models";
import { Ifirm } from "./firm.type";
import { CropModel } from "../crop/crope.model";
import { SensorModel } from "../Sensor/sensor.models";

export const addFirmService = async (
    userId: string,
    firmData: Partial<Ifirm>
): Promise<Ifirm> => {
    const { crops, sensors } = firmData as any;

    // validate crop exists
    const cropExists = await CropModel.findById(crops).lean();
    if (!cropExists) {
        throw new Error("Crop not found");
    }

    // validate sensors array and ownership
    if (!Array.isArray(sensors) || sensors.length === 0) {
        throw new Error("Sensors must be a non-empty array of sensor ids");
    }

    const foundSensors = await SensorModel.find({ _id: { $in: sensors } }).lean();
    if (foundSensors.length !== sensors.length) {
        throw new Error("Some sensors not found");
    }

    const notOwned = foundSensors.find((s: any) => s.owner?.toString() !== userId);
    if (notOwned) {
        throw new Error("You can only attach sensors that you own");
    }

    const newFirm = new FirmModel({ ...firmData, user: userId });
    return await (await newFirm.save()).populate("crops sensors user");
};

export const getFirmsByUserService = async (
    userId: string
): Promise<Ifirm[]> => {
    return await FirmModel.find({ user: userId })
        .populate("crops sensors user")
        .exec();
};

export const getFirmByIdService = async (
    firmId: string
): Promise<Ifirm | null> => {
    return await FirmModel.findById(firmId)
        .populate("crops sensors user")
        .exec();
};

export const updateFirmService = async (
    firmId: string,
    updateData: Partial<Ifirm>
): Promise<Ifirm | null> => {
    // If crops or sensors are being updated, validate them
    if ((updateData as any).crops) {
        const cropExists = await CropModel.findById((updateData as any).crops).lean();
        if (!cropExists) throw new Error("Crop not found");
    }

    if ((updateData as any).sensors) {
        const sensors = (updateData as any).sensors;
        if (!Array.isArray(sensors) || sensors.length === 0) {
            throw new Error("Sensors must be a non-empty array of sensor ids");
        }
        const foundSensors = await SensorModel.find({ _id: { $in: sensors } }).lean();
        if (foundSensors.length !== sensors.length) {
            throw new Error("Some sensors not found");
        }
    }

    return await FirmModel.findByIdAndUpdate(firmId, updateData, {
        new: true,
    })
        .populate("crops sensors user")
        .exec();
};

export const deleteFirmService = async (
    firmId: string
): Promise<Ifirm | null> => {
    return await FirmModel.findByIdAndDelete(firmId).populate("crops sensors user").exec();
};
