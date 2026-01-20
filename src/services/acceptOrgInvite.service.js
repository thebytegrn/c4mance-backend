import mongoose from "mongoose";
import { memberAcceptInviteValidator } from "../constants/validators.constants.js";
import { redisClient } from "../index.js";
import { User } from "../models/user.model.js";

export const acceptOrgInviteService = async (req, res) => {
  try {
    const inviteToken = req.query?.invite_token;

    const memberInviteKey = `orgMemberInvite:${inviteToken}`;

    const storedInvite = await redisClient.get(memberInviteKey);

    if (!storedInvite)
      return res
        .status(400)
        .json({ success: false, message: "Invite expired, contact admin" });

    const { password: userPassword } = memberAcceptInviteValidator.parse(
      req.body,
    );

    const parsedStore = JSON.parse(storedInvite);

    parsedStore.user.password = userPassword;

    const user = parsedStore.user;

    const newUser = new User({
      ...user,
      departmentRole: parsedStore.departmentRole,
      departmentId: new mongoose.Types.ObjectId(parsedStore.departmentId),
      reportingLine: parsedStore.reportingLine,
      emailVerified: true,
    });

    await newUser.save();

    return res
      .status(201)
      .json({ success: true, message: "Member joined successfully" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
