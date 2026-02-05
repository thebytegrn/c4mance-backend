import { paystackAxios } from "../constants/api.constant.js";
import { BillingPlan } from "../models/billingPlan.model.js";
import { getEmailPlusAddressing } from "../utils/getEmailPlusAddressing.util.js";

export const initializeSubscription = async (req, res) => {
  try {
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

    if (!billingPlan) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan code" });
    }

    const planCost = billingPlan.amount * 100;

    const customerEmail =
      process.env.NODE_ENV === "local"
        ? getEmailPlusAddressing(user.email)
        : user.email;

    const initSubOptions = {
      email: customerEmail,
      plan: planCode,
      amount: planCost,
      channels: ["card"],
      callback_url,
      metadata: { newCustomer: req.authUser._id },
    };

    const subRes = await paystackAxios.post(
      "/transaction/initialize",
      initSubOptions,
    );

    if (subRes.status !== 200) {
      throw new Error();
    }

    return res.status(200).json({
      success: true,
      message: "Subscription link created",
      data: { url: subRes.data.data.authorization_url },
    });
  } catch (error) {
    console.log("Error initializing subscription", error);
    throw error;
  }
};
