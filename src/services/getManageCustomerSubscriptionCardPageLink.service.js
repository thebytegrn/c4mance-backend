import { paystackAxios } from "../constants/api.constant.js";
import { Subscription } from "../models/subscription.model.js";

export const getManageCustomerSubscriptionCardPageLink = async (req, res) => {
  try {
    const customerSub = await Subscription.findOne({
      customer: req.authUser._id,
    }).exec();

    const genLinkRes = await paystackAxios.get(
      `/subscription/${customerSub.subscriptionCode}/manage/link`,
    );

    if (genLinkRes.status !== 200) {
      throw new Error("Failed to generate card management link");
    }

    return res.status(200).json({
      success: true,
      data: { redirectURL: genLinkRes.data.data.link },
    });
  } catch (error) {
    console.log("Error getting customer card update page", error);
    throw error;
  }
};
