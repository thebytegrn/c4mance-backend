import { USER_ROLES } from "../constants/index.js";

export const isAdminUser = (req, res, next) => {
  const isAdminUser = req.authUser.role === USER_ROLES.ADMIN;

  if (!isAdminUser)
    return res
      .status(401)
      .json({ success: false, message: "Privilege Denied" });
  next();
};
