import mongoose from "mongoose";
import { adminEditOrgMemberValidator } from "../constants/validators.constants.js";

export const adminEditMemberProfile = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.isValidObjectId(memberId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid employee ID" });
    }

    const body = adminEditOrgMemberValidator.parse(req.body);

    console.log(body);
    res.send("ok");
  } catch (error) {
    console.log("Error admin edit member profile ", error);
    throw error;
  }
};
