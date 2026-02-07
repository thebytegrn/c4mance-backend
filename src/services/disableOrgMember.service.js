import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Disabled } from "../models/disabled.model.js";
import { deleteAuthSession } from "../utils/deleteAuthSession.util.js";

export const disableOrgMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.isValidObjectId(memberId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid member ID" });
    }

    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Provide a reason for disabling employee",
      });
    }

    await Disabled.create({ entityId: memberId, entity: "Employee", reason });
    await User.findByIdAndUpdate(memberId, { isDisabled: true }).exec();

    await deleteAuthSession(req, res, memberId);

    return res
      .status(200)
      .json({ success: true, message: "Employee disabled" });
  } catch (error) {
    console.log("Error disabling org member ", error);
    throw error;
  }
};
