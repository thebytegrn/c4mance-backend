import mongoose from "mongoose";
import { USER_ROLES } from "../constants/userRoles.constant.js";

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    roles: [{ type: String, required: true, enum: Object.values(USER_ROLES) }],
    organizationId: { type: mongoose.Types.ObjectId, ref: "Organization" },
  },
  { timestamps: true },
);

export const Department = mongoose.model("Department", DepartmentSchema);
