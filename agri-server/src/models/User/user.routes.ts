import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserByIdcontroller,
} from "./user.controller";
import { uploadMiddleware } from "../../middlewares/upload.middleware";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/id", uploadMiddleware.single("image"), updateUserByIdcontroller);
router.delete("/:id", deleteUserById);

export const UserRoutes = router;
