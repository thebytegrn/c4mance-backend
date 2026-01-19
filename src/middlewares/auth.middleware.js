import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      const accessToken = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

      const userId = decoded?.userId;

      if (!userId)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const user = await User.findById(userId);
      const authUser = user.toObject();
      const userOrgId = await user.getUserOrganizationId();

      if (userOrgId) {
        authUser.organizationId = userOrgId;
      }

      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      req.authUser = authUser;
      next();
    } else {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
  } catch {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
