import mongoose from "mongoose";
import config from "./env.config";
import logger from "../utils/logger.utils";

const connectDB = async () => {
    try {
        mongoose.connect(config.dbUri);
        logger.info("===================================");
        logger.info(`Mongodb Connected 🎉 🎉`);
    } catch (err) {
        // This is the line that ran when the connection failed
        logger.error("Failed to Connect Database 😑", err);
        process.exit(1);
    }
};

export default connectDB;
