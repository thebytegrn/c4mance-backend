import crypto from "crypto";
import { paystackEventQueue } from "../../queue/paystack.queue.js";

export const paystackWebhookService = async (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash == req.headers["x-paystack-signature"]) {
      await paystackEventQueue.add("paystackEvent", req.body);
      return res.sendStatus(200);
    }
  } catch (error) {
    console.log("Error in Paystack webhook service", error);
    throw error;
  }
};
