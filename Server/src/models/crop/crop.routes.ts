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
// allow farmers and admins to update crop details
Router.put('/:id', auth("farmer", "admin"), updateCropByIdController);

export const CropRouter = Router;
