import { User } from "../models/user.model.js";
import { Department } from "../models/department.model.js";

export const searchOrgEmployees = async (req, res) => {
  try {
    const searchQuery = req.query?.q;

    if (!searchQuery || searchQuery.trim() === "") {
      return res
        .status(400)
        .json({ success: false, mssage: "Missing query string" });
    }

    const orgId = req.authUser.organizationId;

    const departments = await Department.find({
      organizationId: orgId,
    })
      .select("_id")
      .lean()
      .exec();

    const departmentIds = departments.map((d) => d._id);

    if (departmentIds.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No departments found" });

    const dbQuery = {
      departmentId: { $in: departmentIds },
    };

    const regex = new RegExp(searchQuery.trim(), "i");

    dbQuery.$or = [{ firstName: regex }, { lastName: regex }];

    const members = await User.find(dbQuery)
      .lean()
      .sort({ lastName: 1, firstName: 1 })
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Queried organization employees",
      data: { members },
    });
  } catch (error) {
    console.log("Error fetching employees: ", error);
    throw error;
  }
};
