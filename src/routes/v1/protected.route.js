import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createOrgService } from "../../services/createOrg.service.js";
import { upload } from "../../utils/upload.util.js";
import { Organization } from "../../models/organization.model.js";
import { hasOrganization } from "../../middlewares/hasOrganization.middleware.js";
import { isAdminUser } from "../../middlewares/isAdminUser.middleware.js";

const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.post("/org", isAdminUser, createOrgService);

protectedRouter.post(
  "/upload/logo",
  isAdminUser,
  hasOrganization,
  upload.single("logoFile"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "File not selected" });

      const bucket = "https://c4mance.com";
      await Organization.findByIdAndUpdate(req.organizationId, {
        $set: { logoURL: bucket + "/" + req.file.key },
      });

      return res
        .status(200)
        .json({ success: true, message: "Logo upload successful" });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export default protectedRouter;
