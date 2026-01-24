import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Department } from "../models/department.model.js";

export const getPaginatedOrgMembers = async (req, res) => {
  try {
    const { cursor } = req.query;

    const limit = Number(req.query.limit) || 10;
    const orgId = req.authUser.organizationId;

    const departments = await Department.find({
      organizationId: orgId,
    })
      .select("_id")
      .lean()
      .exec();

    const departmentIds = departments.map((d) => d._id);

    if (departmentIds.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No members found in the organization",
        data: {
          members: [],
          nextCursor: null,
        },
      });
    }
    const filter = {
      departmentId: { $in: departmentIds },
    };

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
      message: "Fetched organization members",
      data: {
        members,
        nextCursor,
      },
    });
  } catch (error) {
    console.log("Error getting paginated members", error);
    throw error;
  }
};
