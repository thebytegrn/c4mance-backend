import bcrypt from "bcryptjs";
import z from "zod";
import { redisClient } from "../index.js";

const OTPValidator = z.object({
  email: z.email(),
  otp: z.string().max(6).min(6),
});

export const verifyForgotPasswordOTP = async (req, res) => {
  try {
    const { otp, email } = OTPValidator.parse(req.body);

    const sessionKey = `forgotPassword:${email}`;

    const hashedOTP = await redisClient.get(sessionKey);

    const isValidOTP = await bcrypt.compare(otp, hashedOTP);

    if (!isValidOTP)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, request OTP" });

    req.session.resetPassword = email;
    await redisClient.del(sessionKey);

    res.status(200).json({ success: true, message: "OTP validated. Proceed" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
