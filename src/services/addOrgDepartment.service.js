import mongoose from "mongoose";
import { addOrgDepartmentValidator } from "../constants/validators.constants.js";
import { Department } from "../models/department.model.js";
import { Organization } from "../models/organization.model.js";

export const addOrgDepartmentService = async (req, res) => {
  try {
    if (!req.authUser.organizationId)
      return res
        .status(403)
        .json({ success: false, message: "Company setup required!" });

    const orgExist = await Organization.findById(
      req.authUser.organizationId,
    ).exec();

    if (!orgExist)
      return res
        .status(403)
        .json({ success: false, message: "Company setup required!" });

    const body = addOrgDepartmentValidator.parse(req.body);

    const newDepartment = new Department({
      ...body,
      organizationId: new mongoose.Types.ObjectId(req.authUser.organizationId),
    });
    await newDepartment.save();

    return res
      .status(201)
      .json({ success: true, message: "Department created" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
