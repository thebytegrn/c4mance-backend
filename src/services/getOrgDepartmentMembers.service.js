import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const getOrgDepartmentMembers = async (req, res) => {
  try {
    const departmentId = req.params?.departmentId;

    if (!mongoose.isValidObjectId(departmentId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });

    const members = await User.find({ departmentId })
      .select("-password")
      .exec();

    if (!members.length)
      res.status(200).json({
        success: true,
        messsage: "Department members",
        data: { totalCount: 0, members },
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
