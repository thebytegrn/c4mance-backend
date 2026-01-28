import mongoose from "mongoose";
import { DEPARTMENT_ROLES } from "../constants/departmentRoles.constant.js";

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roles: [
      { type: String, required: true, enum: Object.values(DEPARTMENT_ROLES) },
    ],
    organizationId: {
      type: mongoose.Types.ObjectId,
      ref: "Organization",
      index: true,
    },
    isDeleted: { type: Boolean, default: false },
    isDisabled: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Department = mongoose.model("Department", DepartmentSchema);
