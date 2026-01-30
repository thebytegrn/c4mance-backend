import mongoose from "mongoose";

const schema = new mongoose.Schema({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenVersion: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

schema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

export const RefreshToken = mongoose.model("RefreshToken", schema);
