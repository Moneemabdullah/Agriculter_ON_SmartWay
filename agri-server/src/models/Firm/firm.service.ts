import { FirmModel } from "./firm.models";
import { Ifirm } from "./firm.type";

export const addFirmService = async (
    firmData: Partial<Ifirm>
): Promise<Ifirm> => {
    const newFirm = new FirmModel(firmData);
    return await newFirm.save();
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
    return await FirmModel.findByIdAndUpdate(firmId, updateData, {
        new: true,
    }).exec();
};

export const deleteFirmService = async (
    firmId: string
): Promise<Ifirm | null> => {
    return await FirmModel.findByIdAndDelete(firmId).exec();
};
