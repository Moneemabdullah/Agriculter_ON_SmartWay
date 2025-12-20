import { Types } from "mongoose";
export interface ISensor {
    owner: Types.ObjectId;
    sensorId: string;
}
