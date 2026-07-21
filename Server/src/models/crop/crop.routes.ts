import express from "express";
import auth from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createCropSchema, updateCropSchema } from "../../validations/crop.validation";
import {
    addCropController,
    deleteCropByIdController,
    getAllCropsController,
    getCropByNameController,
    updateCropByIdController,
} from "./crop.controller";

const Router = express.Router();

Router.post("/", auth("farmer", "admin"), validate(createCropSchema), addCropController);
Router.get("/", getAllCropsController);
Router.get("/:name", getCropByNameController);
Router.delete("/:id", auth("admin"), deleteCropByIdController);
// allow farmers and admins to update crop details
Router.put("/:id", auth("farmer", "admin"), validate(updateCropSchema), updateCropByIdController);

export const CropRouter = Router;
