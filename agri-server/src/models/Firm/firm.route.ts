import express from "express";
import {
    addFirmController,
    getFirmByIdController,
    updateFirmController,
} from "./firm.controller";

const Router = express.Router();

Router.post("/", addFirmController);
Router.get("/:id", getFirmByIdController);
Router.put("/:id", updateFirmController);
