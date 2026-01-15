import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    updateProfilePhotoController,
    updateUserByIdcontroller,
} from "./user.controller";

const router = Router();

// Update profile photo - MUST come before /:id routes
router.patch(
    "/profile/photo",
    auth(),
    uploadMiddleware.single("photo"),
    (req, res, next) => {
        updateProfilePhotoController(req, res, next);
    }
);

router.get("/", (req, res, next) => {
    getAllUsers(req, res, next);
});
router.get("/:id", (req, res, next) => {
    getUserById(req, res, next);
});
router.put(
    "/:id",
    auth("farmer"),
    uploadMiddleware.single("photo"),
    (req, res, next) => {
        updateUserByIdcontroller(req, res, next);
    }
);
router.delete("/:id", auth("admin", "farmer"), (req, res, next) => {
    deleteUserById(req, res, next);
});

export const UserRoutes = router;
