import { v2 as cloudinary } from "cloudinary";
import config from "./env.config";
import tr from "zod/v4/locales/tr.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
});

const folderName = "agri-app";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: folderName,
        allowed_formats: ["jpg", "png", "jpeg", "webp"],
        transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
    } as any,
});

export default storage;
