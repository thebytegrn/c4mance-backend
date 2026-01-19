import mongoose, { Schema } from "mongoose";
import { USER_ROLES } from "../constants/userRoles.constant.js";
import { Organization } from "./organization.model.js";
import { Department } from "./department.model.js";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 2 },
    lastName: { type: String, required: true, minLength: 2 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 8 },
    isRoot: { type: Boolean, default: false },
    role: {
      type: String,
      required: true,
      enum: Object.values(USER_ROLES),
    },
    departmentId: { type: mongoose.Types.ObjectId, ref: "Department" },
    emailVerified: { type: Boolean, default: false },
    authTokenVersion: { type: Number, default: 0 },
  },
  { timestamps: true },
);

UserSchema.methods.getUserOrganizationId = async function () {
  if (this.isRoot) {
    const org = await Organization.findOne({ ownerId: this._id }).exec();
    if (org) return org._id;
  }

  const dept = await Department.findById(this.departmentId).exec();
  if (dept) return dept.organizationId;
};

export const User = mongoose.model("User", UserSchema);
