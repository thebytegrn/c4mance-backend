import { BillingPlan } from "../models/billingPlan.model.js";
import { Subscription } from "../models/subscription.model.js";

export const getCustomerSubscriptions = async (req, res) => {
  try {
    const customerSub = await Subscription.findOne({
      customer: req.authUser._id,
    }).exec();

    const subscriptionPlans = await BillingPlan.find().lean().exec();

    const customerSubPlansWithDefault = subscriptionPlans.map((plan) => {
      if (plan.planCode === customerSub.plan) {
        plan.default = true;
      }

      return plan;
    });

    return res
      .status(200)
      .json({
        success: true,
        message: "Default plan",
        data: { plans: customerSubPlansWithDefault },
      });
  } catch (error) {
    console.log("Error getting cutomer subscriptions", error);
    throw error;
  }
};
