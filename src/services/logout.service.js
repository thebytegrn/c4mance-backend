import { deleteAuthSession } from "../utils/deleteAuthSession.util.js";

export const logoutService = async (req, res) => {
  try {
    const userId = req.authUser._id;
    await deleteAuthSession(req, res, userId);
    res.status(204).json({ success: true, message: "Auth session deleted" });
  } catch (error) {
    console.log("Error logging out user", error);
    throw error;
  }
};
