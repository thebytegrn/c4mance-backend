import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerCode: { type: String, index: true },
    subscriptionCode: { type: String, index: true },
    status: { type: String, default: false },
    plan: String,
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
