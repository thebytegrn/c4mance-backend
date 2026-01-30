import mongoose from "mongoose";
import { BILLING_PLAN } from "../constants/billingPlan.constant.js";

const BillingSchema = new mongoose.Schema(
  {
    cycle: { type: String, enum: Object.keys(BILLING_PLAN), required: true },
    charge: { type: Number, enum: Object.values(BILLING_PLAN), required: true },
    txRef: { type: String, required: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
  },
  { timestamps: true },
);

export const Billing = mongoose.model("Billing", BillingSchema);
