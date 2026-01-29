import { redisClient } from "../index.js";

export const saveOnboardingStep = async (req, res) => {
  try {
    const { step } = req.query;

    if (!Number(step)) {
      return res.status(400).json({
        success: false,
        message: "Step count is missing or not a number",
      });
    }

    const userOnboardKey = `onBoardingUser:${req.authUser?.email}`;

    await redisClient.set(userOnboardKey, JSON.stringify({ step }));

    res.status(200).json({ success: true, message: "Step state saved" });
  } catch (error) {
    console.log("Error updating onboarding step:", error);
    throw error;
  }
};
