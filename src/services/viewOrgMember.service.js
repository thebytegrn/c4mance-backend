import { User } from "../models/user.model.js";
import mongoose from "mongoose";

export const viewOrgMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    if (!mongoose.isValidObjectId(memberId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid member/employee id" });
    }

    const member = await User.findById(memberId)
      .populate("department")
      .select("-password")
      .exec();

    return res
      .status(200)
      .json({ success: true, message: "View employee", data: { member } });
  } catch (error) {
    console.log("Error viewing organization member", error);
    throw error;
  }
};
