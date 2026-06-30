import axios from "axios";
import logger from "../../utils/logger.utils";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const isConfigured = (): boolean => {
    if (!BOT_TOKEN || !CHAT_ID) {
        logger.warn("Telegram not configured: missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
        return false;
    }
    return true;
};

export const sendTelegramAlert = async (message: string) => {
    if (!isConfigured()) return;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    await axios.post(url, {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
    });
};

export const getFirmUpdate = async () => {
    if (!isConfigured()) return null;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    const response = await axios.get(url);
    return response.data;
};
