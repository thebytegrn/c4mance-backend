import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { createOrgService } from "../../services/createOrg.service.js";
import { upload } from "../../utils/upload.util.js";

import { isAdminUser } from "../../middlewares/isAdminUser.middleware.js";
import { isRootUser } from "../../middlewares/isRootUser.middleware.js";
import { addOrgDepartmentService } from "../../services/addOrgDepartment.service.js";
import { inviteMemberService } from "../../services/inviteMember.service.js";
import { getOrgDepartmentsService } from "../../services/getOrgDepartments.service.js";
import { getReportLineUpService } from "../../services/getReportLineUp.service.js";
import { getOrgDepartmentMembers } from "../../services/getOrgDepartmentMembers.service.js";
import { getDepartmentRoles } from "../../services/getDepartmentRoles.service.js";
import { getOrgDepartment } from "../../services/getOrgDepartment.service.js";
import { searchOrgEmployees } from "../../services/searchOrgEmployees.service.js";
import { getPaginatedOrgMembers } from "../../services/getPaginatedOrgMembers.service.js";
import { searchOrgDepartments } from "../../services/searchOrgDepartments.service.js";
import { transferOrgMember } from "../../services/transferOrgMember.service.js";
import { editDepartment } from "../../services/editDepartment.service.js";
import { disableOrgDepartment } from "../../services/disableOrgDepartment.service.js";
import { deleteOrgDepartment } from "../../services/deleteOrgDepartment.service.js";
import { editOrgMemberProfile } from "../../services/editOrgMemberProfile.service.js";
import { changeOrgMemberPassword } from "../../services/changeOrgMemberPassword.service.js";
import { getMemberProfile } from "../../services/getMemberProfile.service.js";
import { uploadLogo } from "../../services/uploadOrgLogo.service.js";
import { uploadProfilePicture } from "../../services/uploadProfilePicture.service.js";
import { saveOnboardingStep } from "../../services/saveOnboardingStep.service.js";
import { deleteUserOnboardingState } from "../../services/deleteUserOnboardingState.service.js";
import { filterOrgMembers } from "../../services/filterOrgMembers.service.js";

const protectedRouter = Router();

protectedRouter.use(authMiddleware);

protectedRouter.patch("/onboarding", saveOnboardingStep);
protectedRouter.delete("/onboarding/skip", deleteUserOnboardingState);

protectedRouter.post("/orgs", isRootUser, createOrgService);
protectedRouter.get("/orgs/members/search", searchOrgEmployees);
protectedRouter.post("/orgs/members/filter", filterOrgMembers);
protectedRouter.post("/orgs/members/invite", inviteMemberService);
protectedRouter.get("/orgs/members", getPaginatedOrgMembers);
protectedRouter.get("/orgs/members/profile", getMemberProfile);
protectedRouter.get(
  "/orgs/reportlineup/:assignedDepartmentalRole",
  getReportLineUpService,
);
protectedRouter.post("/orgs/members/:memberId/transfer", transferOrgMember);
protectedRouter.patch("/orgs/members", editOrgMemberProfile);
protectedRouter.patch("/orgs/members/change-password", changeOrgMemberPassword);

protectedRouter.patch(
  "/orgs/departments/:departmentId",
  isAdminUser,
  editDepartment,
);
protectedRouter.get("/orgs/departments/search", searchOrgDepartments);
protectedRouter.post("/orgs/departments", isAdminUser, addOrgDepartmentService);
protectedRouter.get("/orgs/departments/:departmentId", getOrgDepartment);
protectedRouter.get("/orgs/departments", getOrgDepartmentsService);

protectedRouter.get(
  "/orgs/departments/:departmentId/members",
  getOrgDepartmentMembers,
);
protectedRouter.get("/orgs/departments/roles", getDepartmentRoles);
protectedRouter.post(
  "/orgs/departments/:departmentId/disable",
  disableOrgDepartment,
);
protectedRouter.delete("/orgs/departments/:departmentId", deleteOrgDepartment);

protectedRouter.post(
  "/upload/logo",
  isRootUser,
  isAdminUser,
  upload.single("logoFile"),
  uploadLogo,
);

protectedRouter.post(
  "/upload/profile-picture",
  upload.single("profilePicture"),
  uploadProfilePicture,
);

export default protectedRouter;
