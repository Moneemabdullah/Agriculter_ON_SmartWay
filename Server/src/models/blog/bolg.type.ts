import mongoose from "mongoose";

export interface IBlog {
    title: string;
    content: string;
    likes: number;
    owner: mongoose.Types.ObjectId;
    statues: "draft" | "published" | "blocked";
    createdAt: Date;
    updatedAt: Date;
}
