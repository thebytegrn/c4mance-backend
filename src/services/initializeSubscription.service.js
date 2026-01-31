import { headers } from "../constants/api.constant.js";
import { BillingPlan } from "../models/billingPlan.model.js";

export const initializeSubscription = async (req, res) => {
  try {
    const initSubURL = "https://api.paystack.co/transaction/initialize";

    const user = req.authUser;

    if (!user.isRoot) {
      return res
        .status(403)
        .json({ success: false, message: "You do not own an Organization" });
    }

    const { planCode, callback_url } = req.query;

    if (!planCode || !callback_url) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required query params" });
    }

    const billingPlan = await BillingPlan.findOne({ planCode }).exec();
    const planCost = billingPlan.amount * 100;

    const initSubOptions = {
      email: user.email,
      plan: planCode,
      amount: planCost,
    };

    const subRes = await fetch(initSubURL, {
      method: "POST",
      headers,
      body: JSON.stringify(initSubOptions),
    });

    console.log({ subscriptionResponse: subRes });
    res.send("subscribe");
  } catch (error) {
    console.log("Error initializing subscription", error);
    throw error;
  }
};
