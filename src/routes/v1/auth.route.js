import { Router } from "express";
import { signUpService } from "../../services/auth.service.js";

const authRouter = Router();

authRouter.get("/login", (req, res) => {
  res.send("Login page");
});

authRouter.post("/sign-up", signUpService);

export default authRouter;
