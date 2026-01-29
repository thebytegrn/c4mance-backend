import mongoose from "mongoose";
import { DEPARTMENT_ROLES } from "../constants/departmentRoles.constant.js";

const UserInviteSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  departmentId: {
    type: mongoose.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  departmentRole: {
    type: String,
    enum: Object.values(DEPARTMENT_ROLES),
    required: true,
  },
  reportingLine: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  organizationId: { type: String, required: true },
});

UserInviteSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 48 });

export const UserInvite = mongoose.model("UserInvite", UserInviteSchema);
