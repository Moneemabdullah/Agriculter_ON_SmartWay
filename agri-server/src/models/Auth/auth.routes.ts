import { Router } from "express";
import { signInController, signUpController, meController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);
router.get("/me", auth(), meController);

export const AuthRoutes = router;
