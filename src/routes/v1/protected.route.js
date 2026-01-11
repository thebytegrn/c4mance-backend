import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.post("/", (req, res) => {
  res.send("Protected route");
});

protectedRouter.post("/account", (req, res) => {
  res.send("Protected route");
});

export default protectedRouter;
