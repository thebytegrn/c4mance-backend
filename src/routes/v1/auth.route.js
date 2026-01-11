import { Router } from "express";
import { loginService, signUpService } from "../../services/auth.service.js";

const authRouter = Router();

authRouter.post("/login", loginService);

authRouter.post("/sign-up", signUpService);

export default authRouter;
