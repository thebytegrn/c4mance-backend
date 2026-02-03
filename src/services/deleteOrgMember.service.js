import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const deleteOrgMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    if (!mongoose.isValidObjectId(memberId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid employee ID" });
    }

    const password = req.body?.password;
    if (!password) {
      return res
        .status(401)
        .json({ success: false, message: "Please provide your password" });
    }

    const isCorrectPassword = await bcrypt.compare(
      password,
      req.authUser.password,
    );

    if (!isCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password, action denied" });
    }

    await User.findByIdAndUpdate(memberId, { isDeleted: true }).exec();
    res
      .status(204)
      .json({ success: true, message: "Employee account deleted" });
  } catch (error) {
    console.log("Error deleting employee", error);
    throw error;
  }
};
