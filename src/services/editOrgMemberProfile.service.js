import { editOrgDepartmentValidator } from "../constants/validators.constants.js";
import { User } from "../models/user.model.js";

export const editOrgMemberProfile = async (req, res) => {
  try {
    const user = req.authUser;
    const body = editOrgDepartmentValidator.partial().strict().parse(req.body);

    const userUpdate = await User.findByIdAndUpdate(user._id, body, {
      new: true,
    }).exec();

    if (!userUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "User with ID not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "User update successful" });
  } catch (error) {
    console.log("Error updating Organization member prfile: ", error);
    throw error;
  }
};
