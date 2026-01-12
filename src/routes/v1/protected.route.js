import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.post("/", (req, res) => {
  res.send("Protected route");
});

protectedRouter.post("/org/${org_id}/member/invite", (req, res) => {
  res.send("user invite");
});

export default protectedRouter;
