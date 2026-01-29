import { redisClient } from "../index.js";

export const deleteUserOnboardingState = async (req, res) => {
  try {
    const userOnboardKey = `onBoardingUser:${req.authUser?.email}`;

    await redisClient.del(userOnboardKey);

    res.status(200).json({ success: true, message: "User onboarding skipped" });
  } catch (error) {
    console.log("Error deleting user onboard state: ", error);
    throw error;
  }
};
