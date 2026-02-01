import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerCode: { type: String, index: true, required: true },
    subscriptionCode: { type: String, index: true, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model("Subscription", SubscriptionSchema);
