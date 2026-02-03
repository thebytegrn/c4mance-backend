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
          all: 0,
          disabled: 0,
          active: 0,
        },
      });
    }

    const baseFilter = {
      departmentId: { $in: departmentIds },
    };

    const paginatedFilter = { ...baseFilter };

    if (mongoose.isValidObjectId(cursor)) {
      paginatedFilter._id = { $gt: cursor };
    }

    const [members, all, disabled] = await Promise.all([
      User.find(paginatedFilter)
        .sort({ _id: 1 })
        .limit(limit)
        .populate("department")
        .select("-password")
        .lean(),
      User.countDocuments(baseFilter),
      User.countDocuments({ ...baseFilter, isDisabled: true }),
    ]);

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
        all,
        disabled,
        active: all - disabled,
      },
    });
  } catch (error) {
    console.log("Error getting paginated members", error);
    throw error;
  }
};
