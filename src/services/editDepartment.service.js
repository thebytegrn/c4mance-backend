import { editOrgDepartmentValidator } from "../constants/validators.constants.js";
import { Department } from "../models/department.model.js";

export const editDepartment = async (req, res) => {
  try {
    const fields = editOrgDepartmentValidator.parse(req.body);
    const departmentId = req.params?.departmentId;

    const update = await Department.findByIdAndUpdate(departmentId, fields, {
      new: true,
    }).exec();

    if (!update) {
      return res
        .status(404)
        .json({ success: false, message: "Department not found" });
    }

    res.status(200).json({
      success: true,
      message: "Department updated",
      data: { department: update },
    });
  } catch (error) {
    console.log("Error editing department", error);
    throw error;
  }
};
