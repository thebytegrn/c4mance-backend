import mongoose from "mongoose";
import { Department } from "../models/department.model.js";
import { Deleted } from "../models/deleted.model.js";
import { User } from "../models/user.model.js";

export const deleteOrgDepartment = async (req, res) => {
  try {
    const { departmentId } = req.params;

    if (!mongoose.isValidObjectId(departmentId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid department ID" });
    }

    const dept = await Department.findByIdAndDelete(departmentId).exec();

    if (!dept) {
      return res
        .status(404)
        .json({ success: false, message: "Department with ID not found" });
    }

    const deletedDept = new Deleted({
      entityId: departmentId,
      entity: "Department",
    });

    await deletedDept.save();

    await User.updateMany({ departmentId }, { $inc: { authTokenVersion: 1 } });

    return res
      .status(204)
      .json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    console.log("Error deleting department:", error);
    throw error;
  }
};
