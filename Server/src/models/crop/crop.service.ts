import { CropModel } from "./crope.model";
import { Crop } from "./crop.@types";

export const addCrop = async (cropData: any) => {
    const newCrop = new CropModel(cropData);
    return await newCrop.save();
};

export const getAllCrops = async (): Promise<Crop[]> => {
    return await CropModel.find();
};

export const getCropByName = async (name: string): Promise<Crop | null> => {
    return await CropModel.findOne({ name });
};
export const deleteCropById = async (id: string): Promise<Crop | null> => {
    return await CropModel.findOneAndDelete({ _id: id });
};
export const updateCropById = async (
    id: string,
    updateData: Partial<Crop>
): Promise<Crop | null> => {
    return await CropModel.findOneAndUpdate({ _id: id }, updateData, {
        new: true,
    });
};
