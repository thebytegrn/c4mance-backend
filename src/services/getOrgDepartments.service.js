import { Department } from "../models/department.model.js";

export const getOrgDepartmentsService = async (req, res) => {
  try {
    const departments = await Department.find({
      organizationId: req.authUser.organizationId,
    }).exec();

    return res
      .status(200)
      .json({
        success: true,
        message: "All organization departments",
        deta: { departments },
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
