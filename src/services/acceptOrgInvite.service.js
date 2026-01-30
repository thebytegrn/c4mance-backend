import { memberAcceptInviteValidator } from "../constants/validators.constants.js";
import { User } from "../models/user.model.js";
import { UserInvite } from "../models/userInvite.model.js";

export const acceptOrgInviteService = async (req, res) => {
  try {
    const { org: organizationId, email } = req.query;

    const invitedUser = await UserInvite.findOne({ organizationId, email })
      .lean()
      .exec();

    if (!invitedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid invite" });
    }

    const { password: userPassword } = memberAcceptInviteValidator.parse(
      req.body,
    );

    invitedUser.password = userPassword;

    const {
      firstName,
      lastName,
      email: userEmail,
      phone,
      password,
      reportingLine,
      departmentRole,
      departmentId,
    } = invitedUser;

    const newUser = new User({
      firstName,
      lastName,
      email: userEmail,
      phone,
      reportingLine,
      password,
      departmentRole,
      departmentId,
      emailVerified: true,
    });

    await newUser.save();

    await UserInvite.findByIdAndDelete(invitedUser._id).exec();

    return res
      .status(201)
      .json({ success: true, message: "Member joined successfully" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
