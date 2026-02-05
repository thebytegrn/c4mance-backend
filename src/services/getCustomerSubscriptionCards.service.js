import { paystackAxios } from "../constants/api.constant.js";
import { Subscription } from "../models/subscription.model.js";

export const getCustomerSubscriptionCards = async (req, res) => {
  try {
    const customerId = req.authUser._id;

    const customerSubscription = await Subscription.findOne({
      customer: customerId,
    })
      .lean()
      .exec();

    const customerCode = customerSubscription.customerCode;

    const customer = await paystackAxios.get(`/customer/${customerCode}`);
    const customerData = customer.data.data;
    const cusAuthorizations = customerData.authorizations;
    const cards = cusAuthorizations.map((card) => {
      return {
        brand: card.brand,
        endingIn: card.last4,
        expiry: card.exp_month.concat("/", card.exp_year),
        isDefault: card.authorization_code === customerSubscription.defaultCard,
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
