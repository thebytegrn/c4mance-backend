import { paystackAxios } from "../constants/api.constant.js";
import { BillingPlan } from "../models/billingPlan.model.js";
import { Subscription } from "../models/subscription.model.js";

export const changeCustomerSubscriptionPlan = async (req, res) => {
  try {
    const userId = req.authUser._id;

    const plans = await BillingPlan.find().select("planCode").lean().exec();

    const planCodes = plans.map((plan) => plan.planCode);

    const newPlan = req.body?.newPlan;
    if (!newPlan || !planCodes.includes(newPlan)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan code" });
    }
    const customer = await Subscription.findOne({ customer: userId }).exec();

    const subscription = await paystackAxios.get(
      `/subscription/${customer.subscriptionCode}`,
    );

    const subscriptionEmailToken = subscription.data.data.email_token;

    const subscriptionDisabled = await paystackAxios.post(
      "/subscription/disable",
      { code: customer.subscriptionCode, token: subscriptionEmailToken },
    );

    if (subscriptionDisabled.status === 200) {
      const subscriptionCreated = await paystackAxios.post("/subscription", {
        customer: customer.customerCode,
        plan: newPlan,
      });

      if (subscriptionCreated.status !== 200)
        throw new Error("Failed to change customer subscription plan");
    } else {
      throw new Error("Failed to change customer subscription plan");
    }

    return res.status(200).json({
      success: true,
      message: "Subscription plan changed successfully",
    });
  } catch (error) {
    console.log("Error changing customer subscription plan", error);
    throw error;
  }
};
