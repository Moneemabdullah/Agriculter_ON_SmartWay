import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUserByIdcontroller,
} from "./user.controller";

const router = Router();

router.get("/", (req, res, next) => {
    getAllUsers(req, res, next);
});
router.get("/:id", (req, res, next) => {
    getUserById(req, res, next);
});
router.put(
    "/id",
    auth("farmer"),
    uploadMiddleware.single("image"),
    (req, res, next) => {
        updateUserByIdcontroller(req, res, next);
    }
);
router.delete("/:id", auth("admin", "farmer"), (req, res, next) => {
    deleteUserById(req, res, next);
});

export const UserRoutes = router;
