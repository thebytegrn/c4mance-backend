import { redisClient } from "../index.js";
import { User } from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { resetForgottenpwdOTPTemp } from "../templates/index.js";
import z from "zod";
import { sendEmail } from "../utils/sendEmail.utils.js";

const emailValidator = z.object({ email: z.email() });

export const forgotPasswordService = async (req, res) => {
  try {
    const { email } = emailValidator.parse(req.body);

    const user = await User.findOne({ email }).exec();
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Unable to process request" });

    const otp = crypto.randomInt(100000, 900000);

    const sessionKey = `forgotPassword:${user.email}`;

    const hashedOTP = await bcrypt.hash(String(otp), 10);

    let emailDeliveryAttemptCount = 0;
    let emailSent = false;

    while (!emailSent && emailDeliveryAttemptCount < 3) {
      const emailRes = await sendEmail({
        from: "C4mance <noreply@c4mance.com>",
        to: user.email,
        subject: "Reset Password",
        html: resetForgottenpwdOTPTemp({
          firstName: user.firstName,
          codeDigits: String(otp).split(""),
          email: user.email,
          year: new Date().getFullYear(),
        }),
      });

      if (emailRes.data) {
        emailSent = true;
      }

      emailDeliveryAttemptCount += 1;
    }

    if (!emailSent) throw new Error("Reset password OTP Email delivery failed");

    await redisClient.setEx(sessionKey, 60 * 5, hashedOTP);

    return res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error("Error in forgotPasswordService:", error);
    throw error;
  }
};
