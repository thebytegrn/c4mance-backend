import { Department } from "../models/department.model.js";
import { User } from "../models/user.model.js";

export const filterOrgMembers = async (req, res) => {
  try {
    const { dept, role, cursor, limit = 10 } = req.query;
    const organizationId = req.authUser.organizationId;

    const query = {};

    if (dept) {
      const deptFilter = Array.isArray(dept) ? dept : [dept];
      const selectedDepartments = await Department.find({
        organizationId,
        _id: { $in: deptFilter },
      }).exec();
      const selectedDepartmentIds = selectedDepartments.map((d) => d._id);
      query.departmentId = { $in: selectedDepartmentIds };
    }

    if (role) {
      const userRoleFilter = Array.isArray(role) ? role : [role];
      const userRoleRegex = userRoleFilter.map(
        (d) => new RegExp(`^${d.trim()}`, "i"),
      );
      query.departmentRole = { $in: userRoleRegex };
    }

    if (cursor) {
      query._id = { $gt: cursor };
    }

    const members = await User.find(query)
      .sort({ _id: 1 })
      .limit(parseInt(limit, 10))
      .populate("department")
      .select("-password -__v")
      .exec();

    const nextCursor =
      members.length > limit ? members[members.length - 1]._id : null;

    return res.status(200).json({
      success: true,
      data: {
        members,
        nextCursor,
      },
    });
  } catch (error) {
    console.log("Error filtering org members: ", error);
    throw error;
  }
};
