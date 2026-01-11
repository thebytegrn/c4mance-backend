import { Router } from "express";
import {
  loginService,
  refreshService,
  signUpService,
} from "../../services/auth.service.js";

const authRouter = Router();

authRouter.post("/login", loginService);

authRouter.post("/sign-up", signUpService);

authRouter.get("/refresh", refreshService);

export default authRouter;
