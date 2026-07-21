import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { signupSchema, signinSchema, changePasswordSchema } from "../../validations/auth.validation";
import {
    changePasswordController,
    meController,
    signInController,
    signUpController,
} from "./auth.controller";

const router = Router();

router.post(
    "/signup",
    uploadMiddleware.single("image"),
    validate(signupSchema),
    (req, res, next) => {
        signUpController(req, res, next);
    }
);
router.post("/signin", validate(signinSchema), (req, res, next) => {
    signInController(req, res, next);
});
router.get("/me", auth(), (req, res, next) => {
    meController(req, res, next);
});
router.post("/change-password", auth(), validate(changePasswordSchema), (req, res, next) => {
    changePasswordController(req, res, next);
});

export const AuthRoutes = router;
