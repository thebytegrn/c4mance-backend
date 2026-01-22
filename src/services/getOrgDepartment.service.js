import mongoose from "mongoose";
import { Department } from "../models/department.model.js";

export const getOrgDepartment = async (req, res) => {
  try {
    const departmentId = req.params?.departmentId;
    const organizationId = req.authUser.organizationId;

    if (!mongoose.isValidObjectId(departmentId))
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });

    const department = await Department.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(departmentId),
          organizationId,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "departmentId",
          as: "members",
        },
      },
      {
        $addFields: {
          membersCount: { $size: "$members" },
          roleCount: { $size: "$roles" },
        },
      },
      {
        $project: {
          members: 0,
        },
      },
    ]);

    if (!department.length) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department details",
      data: { department: department[0] },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
