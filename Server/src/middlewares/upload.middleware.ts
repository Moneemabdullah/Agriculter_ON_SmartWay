import multer from "multer";
import storage from "../config/cloudinary.config";
import logger from "../utils/logger.utils";

const upload = multer({ storage: storage });

export const uploadMiddleware = upload;
