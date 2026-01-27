import { changeOrgMemberPasswordValidator } from "../constants/validators.constants.js";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export const changeOrgMemberPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } =
      changeOrgMemberPasswordValidator.parse(req.body);

    const user = req.authUser;

    const existingUser = await User.findById(user._id).exec();

    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Account deleted" });
    }

    const isCorrectPassword = bcrypt.compare(
      currentPassword,
      existingUser.password,
    );

    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password" });
    }

    existingUser.password = newPassword;
    await existingUser.save();

    res.clearCookie("refreshToken");
    return res
      .status(200)
      .json({ success: true, message: "Password changed, re-login" });
  } catch (error) {
    console.log("Error changing org member password", error);
    throw error;
  }
};
