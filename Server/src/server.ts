import app from "./app";
import config from "./config/env.config";
import logger from "./utils/logger.utils";

const port = config.port || 3000;

app.listen(port, () => {
    logger.info("==================================");
    logger.info(`Server is running on http://localhost:${port} 🚀 🚀`);
    logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
});
