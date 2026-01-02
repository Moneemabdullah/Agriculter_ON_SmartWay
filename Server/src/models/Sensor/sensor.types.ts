import { Types } from "mongoose";
export interface ISensor {
    sensorId: string;
    firmId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
