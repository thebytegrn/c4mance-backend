import { redisClient } from "../index.js";

export const getInvitedMember = async (req, res) => {
  try {
    const isQueryGetInvitedMember = Boolean(req.query?.invited_member) === true;

    if (!isQueryGetInvitedMember)
      return res.status(404).json({ success: false, message: "Not found" });

    const inviteToken = req.query?.invite_token;

    const memberInviteKey = `orgMemberInvite:${inviteToken}`;
    const invitedMember = await redisClient.get(memberInviteKey);

    if (!invitedMember)
      return res.status(404).json({ success: false, message: "Not found" });

    const invitedMemberParsed = JSON.parse(invitedMember).user;

    res.status(200).json({
      success: true,
      message: "Invite found",
      data: { user: invitedMemberParsed },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
