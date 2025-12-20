import { Router } from "express";
import { signInController, signUpController } from "./auth.controller";

const router = Router();

router.post("/signup", signUpController);
router.post("/signin", signInController);

export const AuthRoutes = router;
