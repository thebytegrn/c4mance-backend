import { companySettingsProfileValidator } from "../constants/validators.constants.js";
import { Organization } from "../models/organization.model.js";

export const companySettingsProfile = async (req, res) => {
  try {
    const body = companySettingsProfileValidator
      .partial()
      .strict()
      .parse(req.body);

    const orgOwnerId = req.authUser.organizationId;

    await Organization.findOneAndUpdate({ ownerId: orgOwnerId }, body, {
      new: true,
    }).exec();

    return res
      .status(200)
      .json({ success: true, message: "Company profile updated" });
  } catch (error) {
    console.log("Error company settings", error);
    throw error;
  }
};
