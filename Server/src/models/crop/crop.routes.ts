import express from "express";
// import { addCrop } from "./crop.service";

import auth from "../../middlewares/auth.middleware";
import {
    addCropController,
    deleteCropByIdController,
    getAllCropsController,
    getCropByNameController,
    updateCropByIdController,
} from "./crop.controller";

const Router = express.Router();

Router.post("/", (req, res, next) => {
    addCropController(req, res, next);
});
Router.get("/", (req, res, next) => {
    getAllCropsController(req, res, next);
});
Router.get("/:name", (req, res, next) => {
    getCropByNameController(req, res, next);
});
Router.delete("/:id", auth("admin"), (req, res, next) => {
    deleteCropByIdController(req, res, next);
});
Router.put("/:id", auth("farmer"), (req, res, next) => {
    updateCropByIdController(req, res, next);
});

export const CropRouter = Router;
