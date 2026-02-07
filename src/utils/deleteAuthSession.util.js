import { RefreshToken } from "../models/refreshToken.model.js";

export const deleteAuthSession = async (res, userId) => {
  try {
    await RefreshToken.findOneAndDelete({ userId }).lean().exec();
    res.clearCookie("c4mance-refreshToken");
    res.clearCookie("connect.sid");
  } catch (error) {
    throw new Error("Error clearing deleting auth session", error);
  }
};
