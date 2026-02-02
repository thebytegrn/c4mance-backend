import { BillingPlan } from "../models/billingPlan.model.js";

export const getSubscriptionPlans = async (req, res) => {
  try {
    const plans = await BillingPlan.find().exec();

    return res
      .status(200)
      .json({ success: true, message: "Subscription plans", data: { plans } });
  } catch (error) {
    console.log("Error getting subscription plans", error);
    throw error;
  }
};
