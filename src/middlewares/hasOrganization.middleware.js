import { Organization } from "../models/organization.model.js";

export const hasOrganization = async (req, res, next) => {
  const authUserId = req.authUser._id;

  const userOrg = await Organization.findOne({ ownerId: authUserId }).exec();

  if (!userOrg)
    return res
      .status(422)
      .json({ success: false, message: "Organization setup required." });

  req.organizationId = userOrg._id;

  next();
};
