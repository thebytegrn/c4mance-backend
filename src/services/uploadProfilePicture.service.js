import { User } from "../models/user.model.js";

export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "File not selected" });

    const bucket = "https://static.c4mance.com";

    const fileUrl = bucket + "/" + req.file.key;
    await User.findByIdAndUpdate(req.authUser._id, {
      profilePicture: fileUrl,
    }).exec();

    return res
      .status(200)
      .json({ success: true, message: "Upload successful" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
