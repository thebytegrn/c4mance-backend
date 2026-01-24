import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Department } from "../models/department.model.js";

export const transferOrgMember = async (req, res) => {
  try {
    const memberId = req.params?.memberId;
    const departmentId = req.body?.departmentId;

    if (!mongoose.isValidObjectId(departmentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });
    }

    if (!mongoose.isValidObjectId(memberId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid member/employee ID" });
    }

    const organizationId = req.authUser.organizationId;
    const deptExist = await Department.findOne({
      _id: departmentId,
      organizationId,
    }).exec();

    if (!deptExist) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    const update = await User.findByIdAndUpdate(
      memberId,
      { departmentId },
      { new: true },
    )
      .select("-password")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Member/employee transfered",
      data: { member: update },
    });
  } catch (error) {
    console.log("Error transferring org member", error);
    throw error;
  }
};
