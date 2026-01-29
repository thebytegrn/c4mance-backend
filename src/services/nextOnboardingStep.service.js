import { redisClient } from "../index.js";

export const nextOnboardingStep = async (req, res) => {
  try {
    const userOnboardKey = `onBoardingUser:${req.authUser?.email}`;

    const userOnboardStep = await redisClient.get(userOnboardKey);

    if (userOnboardStep) {
      let { step } = JSON.parse(userOnboardStep);
      step += 1;
      await redisClient.set(userOnboardKey, JSON.stringify({ step }));
    }

    res.status(200).json({ success: true, message: "Next step" });
  } catch (error) {
    console.log("Error updating onboarding step:", error);
    throw error;
  }
};
