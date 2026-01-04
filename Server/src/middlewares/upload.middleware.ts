import multer from "multer";
import storage from "../config/cloudinary.config";
import logger from "../utils/logger.utils";

const upload = multer({ storage: storage });

logger.info("Upload middleware configured with Cloudinary storage.", upload);

export const uploadMiddleware = upload;
