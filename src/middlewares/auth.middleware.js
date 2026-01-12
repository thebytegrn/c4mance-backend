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

      if (!userId) throw new Error("Invalid auth token");

      const user = await User.findById(userId);

      if (!user) throw new Error("Invalid auth token");

      req.authUser = user;
      next();
    } else {
      throw new Error("Invalid auth token");
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
