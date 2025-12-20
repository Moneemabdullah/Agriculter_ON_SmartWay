import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    port: process.env.PORT || 3000,
    dbUri: process.env.CONNECTION_STRING || "mongodb://localhost:27017/agri-db",
    jwtSecret: process.env.JWT_SECRET,
};

export default config;
