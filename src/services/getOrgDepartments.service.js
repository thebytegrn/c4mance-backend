import { Department } from "../models/department.model.js";

export const getOrgDepartmentsService = async (req, res) => {
  try {
    const departments = await Department.aggregate([
      {
        $match: {
          organizationId: req.authUser.organizationId,
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

    return res.status(200).json({
      success: true,
      message: "All organization departments",
      data: { departments },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
