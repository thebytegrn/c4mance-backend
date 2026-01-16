import { Organization } from "../models/organization.model.js";
import { createOrgValidator } from "../constants/validators.constants.js";

export const createOrgService = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ success: false, message: "Form data is null" });

    const { name, email, address } = createOrgValidator.parse(req.body);

    const existingDefaultOrg = await Organization.findOne({
      ownerId: req.authUser._id,
      isDefault: true,
    }).exec();

    const newOrganization = new Organization({
      name,
      email,
      address,
      ownerId: req.authUser._id,
    });

    if (existingDefaultOrg) {
      newOrganization.isDefault = false;
    }

    newOrganization.isDefault = true;

    await newOrganization.save();

    return res
      .status(201)
      .json({ success: true, message: "Organization setup successful" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
