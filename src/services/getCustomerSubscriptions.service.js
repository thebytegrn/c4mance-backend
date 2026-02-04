import { Subscription } from "../models/subscription.model.js";

export const getCustomerSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.findOne({
      customer: req.authUser._id,
    }).exec();
    console.log(subs);
    res.send("subs plans");
  } catch (error) {
    console.log("Error getting cutomer subscriptions", error);
    throw error;
  }
};
