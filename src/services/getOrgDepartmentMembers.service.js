import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const getOrgDepartmentMembers = async (req, res) => {
  try {
    const departmentId = req.params?.departmentId;

    if (!mongoose.isValidObjectId(departmentId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });

    const members = await User.find({ departmentId }).exec();

    if (!members.length)
      return res.status(404).json({
        success: false,
        message: "Members with department ID not found",
      });

    res.status(200).json({
      success: true,
      messsage: "Department members",
      data: { totalCount: members.length, members },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
