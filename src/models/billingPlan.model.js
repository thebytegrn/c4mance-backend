import mongoose from "mongoose";
import { BILLING_CYCLE } from "../constants/billing.constants.js";

const BillingPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  desc: { type: String, required: true },
  billingCycle: { type: String, enum: BILLING_CYCLE, required: true },
  planCode: { type: String, required: true },
});

export const BillingPlan = mongoose.model("BillingPlan", BillingPlanSchema);
