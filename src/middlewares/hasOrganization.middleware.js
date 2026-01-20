export const hasOrganization = async (req, res, next) => {
  if (req.authUser.organizationId) return next();

  return res
    .status(403)
    .json({ success: false, message: "Organization setup required" });
};
