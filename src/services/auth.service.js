import { USER_ROLES } from "../constants/index.js";
import {
  signInValidator,
  signUpValidator,
} from "../constants/validators.constants.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmailQueue from "../queue/sendEmail.queue.js";
import { verifyEmailTemplate } from "../templates/index.js";
import { genToken } from "../utils/genToken.utils.js";

import redisClient from "../database/redis.database.js";

export const refreshService = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    return res.status(200).json({
      success: true,
      message: "Refresh token successful",
      data: { accessToken },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loginService = async (req, res) => {
  try {
    if (!req.body || !signInValidator.parse(req.body)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid form data" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "Login failed" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Login failed" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: { accessToken },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const signUpService = async (req, res) => {
  try {
    if (!req.body || !signUpValidator.parse(req.body))
      return res
        .status(400)
        .json({ success: false, message: "Invalid form data" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const parsedForm = signUpValidator.parse(req.body);

    const newUser = new User({
      ...parsedForm,
      password: hashedPassword,
      role: USER_ROLES.ADMIN,
    });

    await newUser.save();

    const token = genToken();
    const emailVerificationURL = `${req.protocol}://${req.host}/v1/auth/verify-email/?token=${token}`;

    await redisClient.setex(
      `emailVerification:${token}`,
      3600 * 24, // expires in a day
      JSON.stringify({ userId: newUser._id })
    );

    sendEmailQueue.add("onboard", {
      from: "C4mance <noreply@c4mance.com>",
      to: newUser.email,
      subject: "Welcome to C4mance!",
      html: verifyEmailTemplate({
        name: newUser.firstName.concat(" ", newUser.lastName),
        email: newUser.email,
        url: emailVerificationURL,
        year: new Date().getFullYear(),
      }),
    });

    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
