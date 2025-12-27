import { Router } from "express";
<<<<<<< HEAD
import { signInController, signUpController } from "./auth.controller";
import { uploadMiddleware } from "../../middlewares/upload.middleware";
=======
import { signInController, signUpController, meController } from "./auth.controller";
import auth from "../../middlewares/auth";
>>>>>>> cf2ddfb4d4f8238784c382bb625a665fb6668635

const router = Router();

router.post("/signup", uploadMiddleware.single("image"), signUpController);
router.post("/signin", signInController);
router.get("/me", auth(), meController);

export const AuthRoutes = router;
