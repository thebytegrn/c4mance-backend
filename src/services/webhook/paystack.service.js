import crypto from "crypto";

export const paystackWebhookService = (req, res) => {
  try {
    const secret = process.env.PAYSTACK_SECRET;
    const hash = crypto
      .createHmac("sha512", secret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash == req.headers["x-paystack-signature"]) {
      const event = req.body;
      console.log(event);
    }
    return res.send(200);
  } catch (error) {
    console.log("Error in Paystack webhook service");
    throw error;
  }
};
