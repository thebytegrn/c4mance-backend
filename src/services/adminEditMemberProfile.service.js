import mongoose from "mongoose";
import { adminEditOrgMemberValidator } from "../constants/validators.constants.js";
import { User } from "../models/user.model.js";

export const adminEditMemberProfile = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.isValidObjectId(memberId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid employee ID" });
    }

    const body = adminEditOrgMemberValidator.partial().strict().parse(req.body);

    await User.findByIdAndUpdate(memberId, body).exec();

    return res
      .status(200)
      .json({ success: true, message: "Update successful" });
  } catch (error) {
    console.log("Error admin edit member profile ", error);
    throw error;
  }
};
