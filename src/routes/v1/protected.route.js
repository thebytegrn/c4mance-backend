import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createOrgService } from "../../services/createOrg.service.js";
import { upload } from "../../utils/upload.util.js";
import { Organization } from "../../models/organization.model.js";

import { isAdminUser } from "../../middlewares/isAdminUser.middleware.js";
import { isRootUser } from "../../middlewares/isRootUser.middleware.js";
import { hasOrganization } from "../../middlewares/hasOrganization.middleware.js";
import { addOrgDepartmentService } from "../../services/addOrgDepartment.service.js";
import { inviteMemberService } from "../../services/inviteMember.service.js";
import { getOrgDepartmentsService } from "../../services/getOrgDepartments.service.js";
import { getReportLineUpService } from "../../services/getReportLineUp.service.js";

const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.post("/orgs", isRootUser, createOrgService);

protectedRouter.post("/orgs/departments", isAdminUser, addOrgDepartmentService);

protectedRouter.post("/orgs/member/invite", inviteMemberService);

protectedRouter.get("/orgs/departments", getOrgDepartmentsService);
protectedRouter.get(
  "/orgs/reportlineup/:assignedDepartmentalRole",
  getReportLineUpService,
);

protectedRouter.post(
  "/upload/logo",
  hasOrganization,
  isAdminUser,
  upload.single("logoFile"),
  async (req, res) => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "File not selected" });

      const bucket = "https://static.c4mance.com";
      await Organization.findByIdAndUpdate(req.authUser.organizationId, {
        $set: { logoURL: bucket + "/" + req.file.key },
      }).exec();

      return res
        .status(200)
        .json({ success: true, message: "Logo upload successful" });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
);

export default protectedRouter;
