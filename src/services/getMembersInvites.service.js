import { UserInvite } from "../models/userInvite.model.js";

export const getMembersInvites = async (req, res) => {
  try {
    const organizationId = req.authUser.organizationId;

    const invites = await UserInvite.find({ organizationId })
      .sort({ createdAt: -1 })
      .exec();

    return res
      .status(200)
      .json({ success: true, message: "Invites", data: { invites } });
  } catch (error) {
    console.log("Error fetching organization member invites: ", error);
  }
};
