import mongoose from "mongoose";
import config from "./env.config";
import logger from "../utils/logger.utils";

let isConnected = false;

const connectDB = async () => {
    try {
        if (isConnected) {
            logger.info("===================================");
            logger.info("Database is already connected 🎉 🎉");
            return;
        }
        await mongoose.connect(config.dbUri);
        isConnected = true;
        logger.info("===================================");
        logger.info(`Mongodb Connected 🎉 🎉`);
    } catch (err) {
        // This is the line that ran when the connection failed
        logger.error("Failed to Connect Database 😑", err);
        process.exit(1);
    }
};

export default connectDB;
