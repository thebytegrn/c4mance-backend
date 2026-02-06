import { paystackAxios } from "../constants/api.constant.js";
import { Subscription } from "../models/subscription.model.js";

export const getCustomerSubscriptionCards = async (req, res) => {
  try {
    const customerId = req.authUser._id;

    const subscription = await Subscription.findOne({
      customer: customerId,
    })
      .lean()
      .exec();

    const customerCode = subscription.customerCode;

    const customer = await paystackAxios.get(`/customer/${customerCode}`);
    const customerSubscription = await paystackAxios.get(
      `/subscription/${subscription.subscriptionCode}`,
    );

    const customerSubscriptionAuth =
      customerSubscription.data.data.authorization.authorization_code;
    const customerData = customer.data.data;
    const cusAuthorizations = customerData.authorizations;
    const cards = cusAuthorizations.map((card) => {
      return {
        brand: card.brand,
        endingIn: card.last4,
        expiry: card.exp_month.concat("/", card.exp_year),
        isDefault: card.authorization_code === customerSubscriptionAuth,
      };
    });

    return res
      .status(200)
      .json({ success: true, message: "Customer cards", data: { cards } });
  } catch (error) {
    console.log("Error getting customer subscriptions ", error);
    throw error;
  }
};
