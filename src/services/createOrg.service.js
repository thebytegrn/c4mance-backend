import { Organization } from "../models/organization.model.js";
import { createOrgValidator } from "../constants/validators.constants.js";
import { User } from "../models/user.model.js";

export const createOrgService = async (req, res) => {
  try {
    if (!req.body)
      return res
        .status(400)
        .json({ success: false, message: "Form data is null" });

    const { name, email, address } = createOrgValidator.parse(req.body);

    const newOrganization = new Organization({
      name,
      email,
      address,
      ownerId: req.authUser._id,
    });

    await newOrganization.save();

    await User.findByIdAndUpdate(req.authUser._id, {
      organizationId: newOrganization._id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Organization setup successful" });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
