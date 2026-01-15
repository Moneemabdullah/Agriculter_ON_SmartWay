import { CropModel } from "../crop/crope.model";
import { FirmModel } from "./firm.models";
import { Ifirm, ISensor } from "./firm.type";

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
        owner: userId,
        photos: firmData.photos || [],
    });

    const savedFirm = await newFirm.save();

    // Populate crops fully, but only select safe fields from owner
    return await savedFirm.populate([
        { path: "crops" }, // crops can remain fully populated
        {
            path: "owner",
            select: "name role photo", // only include these fields
        },
    ]);
};

export const getFirmsByUserService = async (
    userId: string
): Promise<Ifirm[]> => {
    return await FirmModel.find({ owner: userId })
        .populate([
            { path: "crops" },
            { path: "owner", select: "name email role" },
        ])
        .exec();
};

export const getFirmByIdService = async (
    firmId: string
): Promise<Ifirm | null> => {
    return await FirmModel.findById(firmId)
        .populate([
            { path: "crops" },
            { path: "owner", select: "name email role" },
        ])
        .exec();
};

export const updateFirmService = async (
    firmId: string,
    updateData: Partial<Ifirm>
): Promise<Ifirm | null> => {
    // If crops or sensors are being updated, validate them
    if ((updateData as Partial<Ifirm>).crops) {
        const cropExists = await CropModel.findById(
            (updateData as Partial<Ifirm>).crops
        ).lean();
        if (!cropExists) throw new Error("Crop not found");
    }

    return await FirmModel.findByIdAndUpdate(firmId, updateData, {
        new: true,
    })
        .populate([
            { path: "crops" },
            { path: "owner", select: "name email role" },
        ])
        .exec();
};

export const deleteFirmService = async (
    firmId: string
): Promise<Ifirm | null> => {
    return await FirmModel.findByIdAndDelete(firmId)
        .populate([
            { path: "crops" },
            { path: "owner", select: "name email role" },
        ])
        .exec();
};

export const addSensorToFirmService = async (
    firmId: string,
    sensorId: string
): Promise<Ifirm | null> => {
    const firm = await FirmModel.findById(firmId);
    if (!firm) {
        throw new Error("Firm not found");
    }

    // Check if sensor already exists
    const sensorExists = firm.sensors?.some(
        (s: ISensor) => s.sensorId === sensorId
    );
    if (sensorExists) {
        throw new Error("Sensor already linked to this farm");
    }

    return await FirmModel.findByIdAndUpdate(
        firmId,
        {
            $push: {
                sensors: {
                    sensorId,
                    createdAt: new Date(),
                    status: "active",
                },
            },
        },
        { new: true }
    )
        .populate([
            { path: "crops" },
            { path: "owner", select: "name email role" },
        ])
        .exec();
};
