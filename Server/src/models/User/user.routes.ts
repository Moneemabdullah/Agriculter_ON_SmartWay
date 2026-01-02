import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserByIdcontroller,
} from "./user.controller";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import auth from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put(
    "/id",
    auth("user"),
    uploadMiddleware.single("image"),
    updateUserByIdcontroller
);
router.delete("/:id", auth("admin", "user"), deleteUserById);

export const UserRoutes = router;
