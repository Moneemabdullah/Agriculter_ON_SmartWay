import { CropModel } from "../crop/crope.model";
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
        .populate("crops sensors owner")
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
    if ((updateData as Partial<Ifirm>).crops) {
        const cropExists = await CropModel.findById(
            (updateData as Partial<Ifirm>).crops
        ).lean();
        if (!cropExists) throw new Error("Crop not found");
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
