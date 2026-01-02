import express from "express";
import {
    addFirmController,
    deleteFirmController,
    getFirmByIdController,
    updateFirmController,
} from "./firm.controller";
import auth from "../../middlewares/auth.middleware";

const Router = express.Router();

Router.post("/", addFirmController);
Router.get("/:id", getFirmByIdController);
Router.put("/:id",auth("user"), updateFirmController);
Router.delete("/:id", auth("admin", "user"), deleteFirmController);

export const FirmRouter = Router;
