import { Router } from "express";
import { getAllUsers, getUserById, deleteUserById } from "./user.controller";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserById);

export const UserRoutes = router;
