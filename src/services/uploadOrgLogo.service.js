import { Organization } from "../models/organization.model.js";

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "File not selected" });

    const bucket = "https://static.c4mance.com";
    await Organization.findByIdAndUpdate(req.authUser.organizationId, {
      $set: { logoURL: bucket + "/" + req.file.key },
    }).exec();

    return res
      .status(200)
      .json({ success: true, message: "Logo upload successful" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
