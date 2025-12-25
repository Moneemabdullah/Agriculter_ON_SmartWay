import express from "express";
// import { addCrop } from "./crop.service";

import {
    addCropController,
    deleteCropByIdController,
    getAllCropsController,
    getCropByNameController,
    updateCropByIdController,
} from "./crop.controller";

const Router = express.Router();

Router.post("/", addCropController);
Router.get("/", getAllCropsController);
Router.get("/:name", getCropByNameController);
Router.delete("/:id", deleteCropByIdController);
Router.put("/:id", updateCropByIdController);

export default Router;
