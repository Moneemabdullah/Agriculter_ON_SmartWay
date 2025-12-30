import { Router } from "express";
import {
    signInController,
    signUpController,
    meController,
} from "./auth.controller";
import auth from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/signup", uploadMiddleware.single("image"), signUpController);
router.post("/signin", signInController);
router.get("/me", auth(), meController);

export const AuthRoutes = router;
