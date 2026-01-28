import mongoose, { Schema } from "mongoose";
import { USER_ROLES } from "../constants/userRoles.constant.js";
import { Organization } from "./organization.model.js";
import { Department } from "./department.model.js";
import { DEPARTMENT_ROLES } from "../constants/departmentRoles.constant.js";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    firstName: { type: String, required: true, minLength: 2, index: true },
    lastName: { type: String, required: true, minLength: 2, index: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minLength: 8 },
    isRoot: { type: Boolean, default: false },
    profilePicture: String,
    phone: String,
    reportingLine: { type: String, enum: Object.values(DEPARTMENT_ROLES) },
    role: {
      type: String,
      default: USER_ROLES.USER,
      enum: Object.values(USER_ROLES),
    },
    departmentId: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      index: true,
    },
    departmentRole: { type: String, enum: Object.values(DEPARTMENT_ROLES) },
    emailVerified: { type: Boolean, default: false },
    authTokenVersion: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $eq: false } } },
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

UserSchema.methods.getUserOrganizationId = async function () {
  if (this.isRoot) {
    const org = await Organization.findOne({ ownerId: this._id }).exec();
    if (org) return org._id;
  }

  const dept = await Department.findById(this.departmentId).exec();
  if (dept) return dept.organizationId;
};

export const User = mongoose.model("User", UserSchema);
