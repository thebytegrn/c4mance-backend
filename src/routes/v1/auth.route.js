import { Router } from "express";
import {
  loginService,
  refreshService,
  signUpService,
  verifyEmailService,
} from "../../services/auth.service.js";
import { forgotPasswordService } from "../../services/forgotPassword.service.js";
import { verifyForgotPasswordOTP } from "../../services/verifyForgotPassword.OTP.service.js";
import { resetPasswordService } from "../../services/resetPassword.service.js";

const authRouter = Router();

authRouter.post("/login", loginService);

authRouter.post("/sign-up", signUpService);

authRouter.get("/refresh", refreshService);

authRouter.get("/verify-email", verifyEmailService);

authRouter.post("/forgot-password", forgotPasswordService);

authRouter.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);

authRouter.post("/reset-password", resetPasswordService);

export default authRouter;
