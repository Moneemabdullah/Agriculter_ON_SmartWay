import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 3000,
    dbUri: process.env.CONNECTION_STRING || "mongodb://localhost:27017/agri-db",
    jwtSecret: process.env.JWT_SECRET,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.CLOUDINARY_API_KEY || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
    },
};

export default config;
