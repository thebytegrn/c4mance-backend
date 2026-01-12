import mongoose, { Schema } from "mongoose";
import { USER_ROLES } from "../constants/index.js";

const schema = new Schema({
  firstName: { type: String, required: true, minLength: 2 },
  lastName: { type: String, required: true, minLength: 2 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 8 },
  role: { type: String, required: true, enum: Object.values(USER_ROLES) },
  emailVerified: { type: Boolean, default: false },
  authTokenVersion: { type: Number, default: 0 },
});

export const User = mongoose.model("User", schema);
