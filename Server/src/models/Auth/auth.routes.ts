import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import {
    meController,
    signInController,
    signUpController,
} from "./auth.controller";

const router = Router();

router.post("/signup", uploadMiddleware.single("image"), (req, res, next) => {
    signUpController(req, res, next);
});
router.post("/signin", (req, res, next) => {
    signInController(req, res, next);
});
router.get("/me", auth(), (req, res, next) => {
    meController(req, res, next);
});

export const AuthRoutes = router;
