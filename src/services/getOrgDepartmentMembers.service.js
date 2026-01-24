import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const getOrgDepartmentMembers = async (req, res) => {
  try {
    const { cursor } = req.query;
    const limit = 10;
    const departmentId = req.params?.departmentId;

    if (!mongoose.isValidObjectId(departmentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });
    }

    const filter = { departmentId };
    if (mongoose.isValidObjectId(cursor)) {
      filter._id = { $gt: cursor };
    }

    const members = await User.find(filter)
      .sort({ _id: 1 })
      .limit(limit)
      .select("-password")
      .lean();

    let nextCursor = null;
    if (members.length === limit) {
      nextCursor = members[members.length - 1]._id;
    }

    return res.status(200).json({
      success: true,
      message: "Department members",
      data: {
        members,
        nextCursor,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
