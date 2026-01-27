import mongoose from "mongoose";
import { Department } from "../models/department.model.js";

export const getOrgDepartmentsService = async (req, res) => {
  try {
    const { cursor } = req.query;
    const limit = Number(req.query.limit) || 10;
    const orgId = req.authUser.organizationId;

    if (cursor && !mongoose.isValidObjectId(cursor)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid cursor" });
    }

    const pipeline = [
      {
        $match: {
          organizationId: orgId,
        },
      },
    ];

    if (cursor) {
      pipeline.push({
        $match: {
          _id: { $gt: new mongoose.Types.ObjectId(cursor) },
        },
      });
    }

    pipeline.push(
      {
        $sort: { _id: 1 },
      },
      {
        $limit: limit,
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
        $lookup: {
          from: "disabled",
          localField: "_id",
          foreignField: "entityId",
          as: "disabledDoc",
        },
      },
      {
        $addFields: {
          membersCount: { $size: "$members" },
          roleCount: { $size: "$roles" },
          isDisabled: { $gt: [{ $size: "$disabledDoc" }, 0] },
        },
      },
      {
        $project: {
          members: 0,
          disabledDoc: 0,
        },
      },
    );
    const departments = await Department.aggregate(pipeline);

    let nextCursor = null;

    if (departments.length === limit) {
      nextCursor = departments[departments.length - 1]._id;
    }

    return res.status(200).json({
      success: true,
      message: "All organization departments",
      data: { departments, nextCursor },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
