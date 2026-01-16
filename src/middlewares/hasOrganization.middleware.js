import mongoose from "mongoose";

export const hasOrganization = (req, res, next) => {
  if (
    !req.authUser.organizationId ||
    !mongoose.isValidObjectId(req.authUser.organizationId)
  )
    return res
      .status(422)
      .json({ success: false, message: "Organization setup required" });
  next();
};
