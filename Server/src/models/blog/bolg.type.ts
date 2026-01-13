import mongoose from "mongoose";

export interface IBlog {
    title: string;
    content: string;
    likes: number;
    photos?: string[];
    owner: mongoose.Types.ObjectId;
    statues: "draft" | "published" | "blocked";
    createdAt: Date;
    updatedAt: Date;
}
