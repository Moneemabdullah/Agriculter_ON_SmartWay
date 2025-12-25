import { Router } from "express";
import { AuthRoutes } from "./models/Auth/auth.routes";

const router = Router();

router.use("/auth", AuthRoutes);

export const mainRouter = router;
