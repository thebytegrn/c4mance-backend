import { Department } from "../models/department.model.js";
import { Organization } from "../models/organization.model.js";

export const getUserOrgMiddleware = async (req, res, next) => {
  const isRootUser = req.authUser.isRoot;

  if (isRootUser) {
    const userOrg = await Organization.findOne({
      ownerId: req.authUser.id,
    }).exec();

    if (userOrg) {
      req.organizationId = userOrg.id;
      return next();
    }
  }

  const userDept = await Department.findById(req.authUser.departmentId).exec();
  if (userDept) {
    req.organizationId = userDept.organizationId;
    return next();
  }

  return res
    .status(422)
    .json({ success: false, message: "Unable to process request" });
};
