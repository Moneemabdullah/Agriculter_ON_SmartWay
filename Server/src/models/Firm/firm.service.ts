import { CropModel } from "../crop/crope.model";
import { SensorModel } from "../Sensor/sensor.models";
import { FirmModel } from "./firm.models";
import { Ifirm } from "./firm.type";

export const addFirmService = async (
    userId: string,
    firmData: Partial<Ifirm>
): Promise<Ifirm> => {
    if (!firmData.crops) {
        throw new Error("Crop is required");
    }

    // Validate crop existence
    const cropExists = await CropModel.findById(firmData.crops);
    if (!cropExists) {
        throw new Error("Crop not found");
    }

    const newFirm = new FirmModel({
        ...firmData,
        user: userId,
    });

    const savedFirm = await newFirm.save();

    return await savedFirm.populate("crops sensors user");
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
        const cropExists = await CropModel.findById(
            (updateData as any).crops
        ).lean();
        if (!cropExists) throw new Error("Crop not found");
    }

    if ((updateData as any).sensors) {
        const sensors = (updateData as any).sensors;
        if (!Array.isArray(sensors) || sensors.length === 0) {
            throw new Error("Sensors must be a non-empty array of sensor ids");
        }
        const foundSensors = await SensorModel.find({
            _id: { $in: sensors },
        }).lean();
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
    return await FirmModel.findByIdAndDelete(firmId)
        .populate("crops sensors user")
        .exec();
};
