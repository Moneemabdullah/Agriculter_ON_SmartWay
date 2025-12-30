import express from "express";
// import { addCrop } from "./crop.service";

import {
    addCropController,
    deleteCropByIdController,
    getAllCropsController,
    getCropByNameController,
    updateCropByIdController,
} from "./crop.controller";
import auth from "../../middlewares/auth.middleware";

const Router = express.Router();

Router.post("/", addCropController);
Router.get("/", getAllCropsController);
Router.get("/:name", getCropByNameController);
Router.delete("/:id", auth("admin"), deleteCropByIdController);
Router.put("/:id", auth("user"), updateCropByIdController);

export const CropRouter = Router;
