import app from "./app";
import config from "./config/index";

const port = config.port || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port} 🚀 🚀`);
});
