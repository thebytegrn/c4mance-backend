import { DEPARTMENT_ROLES } from "../constants/departmentRoles.constant.js";

export const getReportLineUpService = async (req, res) => {
  try {
    const assignedDepartmentalRole = req.params?.assignedDepartmentalRole;

    const lineUp = Object.values(DEPARTMENT_ROLES).filter(
      (role) => role.toLowerCase() !== assignedDepartmentalRole.toLowerCase(),
    );

    return res.status(200).json({
      success: true,
      message: "Reporting line",
      data: { reportingLine: lineUp },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
