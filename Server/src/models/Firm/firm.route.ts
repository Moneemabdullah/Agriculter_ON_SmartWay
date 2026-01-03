import express from "express";
import {
    addFirmController,
    deleteFirmController,
    getAllFirmsController,
    getFirmByIdController,
    updateFirmController,
} from "./firm.controller";
import auth from "../../middlewares/auth.middleware";

const Router = express.Router();

// Create a firm (farmer only)
Router.post("/", auth("farmer"), addFirmController);

// Get all firms for logged in user
Router.get("/", auth(), getAllFirmsController);

// Get a single firm
Router.get("/:id", auth(), getFirmByIdController);

// Update firm
Router.patch("/:id", auth(), updateFirmController);

// Delete firm
Router.delete("/:id", auth(), deleteFirmController);

export const FirmRouter = Router;
