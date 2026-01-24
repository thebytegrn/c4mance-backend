import { Department } from "../models/department.model.js";

export const searchOrgDepartments = async (req, res) => {
  try {
    const searchQuery = req.query?.q;
    if (!searchQuery) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    const orgId = req.authUser.organizationId;
    const regex = new RegExp(searchQuery, "i");

    const departments = await Department.aggregate([
      {
        $match: {
          organizationId: orgId,
          name: { $regex: regex },
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

    if (!departments.length) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Departments found",
          data: { departments },
        });
    }

    return res.status(200).json({
      success: true,
      message: "Departments found",
      data: { departments },
    });
  } catch (error) {
    console.log("Error searching departments", error);
    throw error;
  }
};
