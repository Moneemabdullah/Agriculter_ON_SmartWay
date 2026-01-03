import { IBlog } from "./bolg.type";
import mongoose from "mongoose";

const blogModel = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        likes: { type: Number, default: 0 },
        owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        statues: {
            type: String,
            enum: ["draft", "published", "blocked"],
            default: "draft",
        },
    },
    { timestamps: true }
);

export default mongoose.model<IBlog>("Blog", blogModel);
