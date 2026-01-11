import { USER_ROLES } from "../constants/index.js";
import { signUpValidator } from "../constants/validators.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const loginService = (req, res) => {
  res.send("Login page");
};

export const signUpService = async (req, res) => {
  try {
    if (!req.body || !signUpValidator.parse(req.body))
      return res
        .status(400)
        .json({ success: false, message: "Invalid form data" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
