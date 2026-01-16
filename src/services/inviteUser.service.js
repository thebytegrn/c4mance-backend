import { Organization } from "../models/organization.model.js";

export const inviteUserService = async (req, res) => {
  try {
    res.send("User invite");
  } catch (error) {
    console.log(error);
  }
};
