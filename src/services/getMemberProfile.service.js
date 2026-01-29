import { User } from "../models/user.model.js";

export const getMemberProfile = async (req, res) => {
  try {
    const user = req.authUser._id;

    const profile = await User.findById(user)
      .populate("departmentId")
      .select("-password")
      .exec();

    return res
      .status(200)
      .json({ success: true, message: "Member Profile", data: { profile } });
  } catch (error) {
    console.log("Error getting member profile", error);
    throw error;
  }
};
