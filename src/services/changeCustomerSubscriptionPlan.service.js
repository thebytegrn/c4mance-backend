import { paystackAxios } from "../constants/api.constant.js";
import { Subscription } from "../models/subscription.model.js";

export const changeCustomerSubscriptionPlan = async (req, res) => {
  try {
    const userId = req.authUser._id;
    const sub = await Subscription.findOne({ customer: userId }).exec();

    console.log(sub);
    res.send("change");
  } catch (error) {
    console.log("Error changing customer subscription plan", error);
    throw error;
  }
};
