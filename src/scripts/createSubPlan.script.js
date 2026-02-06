import mongoose from "mongoose";
import { BillingPlan } from "../models/billingPlan.model.js";

(async () => {
  try {
    const mongo_uri = ""; // remeber to remove uri after use

    await mongoose.connect(mongo_uri);

    const monthlyPlan = new BillingPlan({
      name: "Monthly Subscription",
      amount: 19999,
      desc: "Flexible, pay-as-you-go access with no long-term commitment.",
      billingCycle: "per month",
      planCode: "PLN_wfjpjkaweok51gk",
    });

    const annualPlan = new BillingPlan({
      name: "Annual Subscription",
      amount: 199999,
      desc: "Save more with a full year of access billed once at a discounted rate.",
      billingCycle: "per annum",
      planCode: "PLN_tuens46leufeong",
    });

    await monthlyPlan.save();
    await annualPlan.save();

    process.exit(0);
  } catch (error) {
    console.log("Error creating subscription plans ", error);
    process.exit(1);
  }
})();
