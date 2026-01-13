import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createOrgService } from "../../services/createOrg.service.js";
import { upload } from "../../utils/upload.util.js";
import mongoose from "mongoose";

const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.post("/", (req, res) => {
  res.send("Protected route");
});

protectedRouter.post("/org", createOrgService);

protectedRouter.post("/org/${org_id}/member/invite", (req, res) => {
  res.send("user invite");
});

protectedRouter.post(
  "/upload/logo",
  (req, res, next) => {
    if (
      !req.authUser.organizationId ||
      !mongoose.isValidObjectId(req.authUser.organizationId)
    )
      return res
        .status(422)
        .json({ success: false, message: "Organization setup required" });
    next();
  },
  upload.single("logoFile"),
  (req, res) => {
    res.status(200).json({ success: true, message: "Upload successful" });
  }
);

export default protectedRouter;
