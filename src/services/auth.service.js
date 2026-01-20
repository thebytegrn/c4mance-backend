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

import { redisClient } from "../index.js";
import { RefreshToken } from "../models/refreshToken.model.js";
import { USER_ROLES } from "../constants/userRoles.constant.js";

export const refreshService = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    const tokenExist = await RefreshToken.findOne({
      userId: decoded.userId,
      token: refreshToken,
    }).exec();

    if (!user || !tokenExist) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (decoded.version !== user.authTokenVersion) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { userId: user._id, version: user.authTokenVersion },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await RefreshToken.findOneAndUpdate(
      { userId: user._id },
      { token: newRefreshToken, tokenVersion: user.authTokenVersion },
    );

    return res.status(200).json({
      success: true,
      message: "Refresh token successful",
      data: { accessToken },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, message: "Invalid/Expired token" });
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
      { userId: user._id, version: user.authTokenVersion },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const saveRefreshToken = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      tokenVersion: user.authTokenVersion,
    });

    await saveRefreshToken.save();

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

export const verifyEmailService = async (req, res) => {
  try {
    const token = req.query?.token;

    if (!token) return res.status(400).send("Invalid or Expired token");

    const verificationToken = await redisClient.get(
      `emailVerification:${token}`,
    );

    if (!verificationToken)
      return res.status(400).send("Invalid or Expired token");

    const userId = JSON.parse(verificationToken).userId;

    await User.findByIdAndUpdate(userId, { emailVerified: true }).exec();
    await redisClient.del(`emailVerification:${token}`);

    return res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <body>
        <p>Email verified successfully. You can now close this tab.</p>
      </body>
    </html>
`);
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

    const parsedForm = signUpValidator.parse(req.body);

    const newUser = new User({
      ...parsedForm,
      role: USER_ROLES.ADMIN,
      isRoot: true,
    });

    await newUser.save();

    const token = genToken();
    const emailVerificationURL = `${req.protocol}://${req.host}/v1/auth/verify-email?token=${token}`;

    await redisClient.setEx(
      `emailVerification:${token}`,
      3600 * 24, // expires in a day
      JSON.stringify({ userId: newUser._id }),
    );

    await sendEmailQueue.add("onboard", {
      from: "C4mance <noreply@c4mance.com>",
      to: newUser.email,
      subject: "Verify your email",
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
