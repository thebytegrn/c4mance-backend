import { Router } from "express";
import {
  loginService,
  refreshService,
  signUpService,
} from "../../services/auth.service.js";

const authRouter = Router();

authRouter.post("/login", loginService);

authRouter.post("/sign-up", signUpService);

authRouter.post("/refresh", refreshService);

export default authRouter;
