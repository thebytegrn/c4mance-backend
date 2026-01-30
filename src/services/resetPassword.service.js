import { signUpValidator } from "../constants/validators.constants.js";
import { User } from "../models/user.model.js";

const resetPasswordValidator = signUpValidator.pick({ password: true });

export const resetPasswordService = async (req, res) => {
  try {
    const { password } = resetPasswordValidator.parse(req.body);

    const email = req.session.resetPassword;

    if (!email)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, request OTP" });

    const user = await User.findOne({ email }).exec();

    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized, request OTP" });

    user.password = password;
    await user.save();

    res.clearCookie("c4mance-refreshToken");
    res.clearCookie("connect.sid");
    req.session.destroy();

    return res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
