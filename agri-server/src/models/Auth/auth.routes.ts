import { Router } from "express";
import { signInController, signUpController } from "./auth.controller";
import { uploadMiddleware } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/signup", uploadMiddleware.single("image"), signUpController);
router.post("/signin", signInController);

export const AuthRoutes = router;
