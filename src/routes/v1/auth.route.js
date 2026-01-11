import { Router } from "express";
import {
  loginService,
  refreshService,
  signUpService,
  verifyEmailService,
} from "../../services/auth.service.js";

const authRouter = Router();

authRouter.post("/login", loginService);

authRouter.post("/sign-up", signUpService);

authRouter.get("/refresh", refreshService);

authRouter.get("/verify-email", verifyEmailService);

export default authRouter;
