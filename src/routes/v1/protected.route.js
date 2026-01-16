import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createOrgService } from "../../services/createOrg.service.js";
import { upload } from "../../utils/upload.util.js";
import { Organization } from "../../models/organization.model.js";
import { inviteUserService } from "../../services/inviteUser.service.js";
import { userInvitePermissionCheck } from "../../middlewares/userInvitePermissionCheck.middleware.js";
import { hasOrganization } from "../../middlewares/hasOrganization.middleware.js";
import { addOrgDepartmentService } from "../../services/addOrgDepartment.service.js";
import { isAdminUser } from "../../middlewares/isAdminUser.middleware.js";
import { getUserOrganizations } from "../../services/getUserOrganizations.service.js";

const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.post("/org", isAdminUser, createOrgService);

protectedRouter.get("/org", isAdminUser, hasOrganization, getUserOrganizations);

protectedRouter.post(
  "/org/department",
  isAdminUser,
  hasOrganization,
  addOrgDepartmentService
);

protectedRouter.post(
  "/org/member/invite",
  isAdminUser,
  userInvitePermissionCheck,
  inviteUserService
);

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
      await Organization.findByIdAndUpdate(req.authUser.organizationId, {
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
