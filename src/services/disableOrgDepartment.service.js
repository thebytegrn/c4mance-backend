import mongoose from "mongoose";
import { DisabledValidator } from "../constants/validators.constants.js";
import { Disabled } from "../models/disabled.model.js";
import { User } from "../models/user.model.js";

export const disableOrgDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { reason } = DisabledValidator.parse(req.body);

    if (!mongoose.isValidObjectId(departmentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });
    }

    const disabledEntity = new Disabled({
      entityId: new mongoose.Types.ObjectId(departmentId),
      entity: "Department",
      reason,
    });

    await disabledEntity.save();

    await User.updateMany(
      { departmentId },
      { $inc: { authTokenVersion: 1 } },
    ).exec();

    return res
      .status(200)
      .json({ success: false, message: "Department disabled" });
  } catch (error) {
    console.log("Error disabling department", error);
    throw error;
  }
};
