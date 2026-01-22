import { DEPARTMENT_ROLES } from "../constants/departmentRoles.constant.js";

export const getDepartmentRoles = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      messsage: "Departments roles",
      data: { roles: DEPARTMENT_ROLES },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
