import express from "express";
import auth from "../../middlewares/auth.middleware";
import {
    addFirmController,
    deleteFirmController,
    getFirmByIdController,
    updateFirmController,
} from "./firm.controller";

const Router = express.Router();

Router.post("/", (req, res, next) => {
    addFirmController(req, res, next);
});
Router.get("/:id", (req, res, next) => {
    getFirmByIdController(req, res, next);
});
Router.put("/:id", auth("farmer"), (req, res, next) => {
    updateFirmController(req, res, next);
});
Router.delete("/:id", auth("admin", "farmer"), (req, res, next) => {
    deleteFirmController(req, res, next);
});

export const FirmRouter = Router;
