import { orgMemberValidator } from "../constants/validators.constants.js";
import sendEmailQueue from "../queue/sendEmail.queue.js";
import { inviteMemberTemplate } from "../templates/index.js";
import mongoose from "mongoose";
import { Department } from "../models/department.model.js";
import { UserInvite } from "../models/userInvite.model.js";
import { User } from "../models/user.model.js";

export const inviteMemberService = async (req, res) => {
  try {
    const body = orgMemberValidator.parse(req.body);

    const isValidDepartmentId = mongoose.isValidObjectId(body.departmentId);

    if (!isValidDepartmentId)
      return res
        .status(400)
        .json({ success: false, message: "role or department does not exist" });

    const department = await Department.findById(body.departmentId).exec();
    const departmentRole = body.departmentRole;

    if (!(department && department.roles.includes(departmentRole))) {
      return res
        .status(400)
        .json({ success: false, message: "role or department does not exist" });
    }

    const isExistingMember = User.findOne({
      departmentId: body.departmentId,
      email: body.user.email,
    }).exec();

    if (isExistingMember) {
      return res.status(409).json({
        success: false,
        message: "Employee with this email exist already in this organization",
      });
    }

    const { firstName, lastName, email, phone } = body.user;

    const memberInviteURL = `${body.redirectURL}?fName=${firstName}&lName=${lastName}&email=${email}&phone=${phone}&org=${req.authUser.organizationId}`;

    const inviteBy = req.authUser.firstName.concat(" ", req.authUser.lastName);

    await sendEmailQueue.add("member-invite", {
      from: "C4mance <noreply@c4mance.com>",
      to: body.user.email,
      subject: "You've been invited!",
      html: inviteMemberTemplate({
        name: firstName,
        inviteBy,
        email,
        url: memberInviteURL,
        year: new Date().getFullYear(),
      }),
    });

    const userInvite = new UserInvite({
      ...body.user,
      departmentId: new mongoose.Types.ObjectId(body.departmentId),
      reportingLine: body.reportingLine,
      departmentRole: body.departmentRole,
      organizationId: new mongoose.Types.ObjectId(req.authUser.organizationId),
    });

    await userInvite.save();

    return res
      .status(200)
      .json({ success: true, message: "Member invite sent" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
