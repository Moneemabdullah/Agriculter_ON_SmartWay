import mongoose from "mongoose";
import config from ".";

const connectDB = async () => {
    try {
        mongoose.connect(config.dbUri);

        console.log(`Mongodb Connected 🎉 🎉`);
    } catch (err) {
        // This is the line that ran when the connection failed
        console.error("Failed to Connect Database 😑", err);
        process.exit(1);
    }
};

export default connectDB;
