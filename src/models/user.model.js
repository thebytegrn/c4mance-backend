import mongoose, { Schema } from "mongoose";
import { USER_ROLES } from "../constants/userRoles.constant.js";

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

export const User = mongoose.model("User", UserSchema);
