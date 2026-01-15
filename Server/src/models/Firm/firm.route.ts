import express from "express";
import auth from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import {
    addFirmController,
    addSensorToFirmController,
    deleteFirmController,
    getAllFirmsController,
    getFirmByIdController,
    updateFirmController,
} from "./firm.controller";

const Router = express.Router();

// Create a firm (farmer only)
Router.post(
    "/",
    uploadMiddleware.array("photos"),
    auth("farmer"),
    addFirmController
);

// Get all firms for logged in user
Router.get("/", auth(), getAllFirmsController);

// Get a single firm
Router.get("/:id", auth(), getFirmByIdController);

// Update firm
Router.patch(
    "/:id",
    uploadMiddleware.array("photos"),
    auth(),
    updateFirmController
);

// Delete firm
Router.delete("/:id", auth(), deleteFirmController);

// Add sensor to firm
Router.post("/:id/sensors", auth(), addSensorToFirmController);

export const FirmRouter = Router;
