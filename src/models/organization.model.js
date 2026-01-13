import mongoose, { Schema } from "mongoose";
import { DEPARTMENT_ROLES } from "../constants/departmentRoles.constants.js";

const schema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    logoURL: String,
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    departments: [
      { name: String, roles: [{ type: String, enum: DEPARTMENT_ROLES }] },
    ],
  },
  { timestamps: true }
);

export const Organization = mongoose.model("Organization", schema);
