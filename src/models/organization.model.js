import mongoose, { Schema } from "mongoose";

const OrganizationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    logoURL: String,
    isDefault: { type: Boolean, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    nextBillDue: Date,
  },
  { timestamps: true },
);

export const Organization = mongoose.model("Organization", OrganizationSchema);
