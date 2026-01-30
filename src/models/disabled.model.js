import mongoose from "mongoose";
import { Entities } from "../constants/entities.constant.js";

const DisabledSchema = new mongoose.Schema(
  {
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    entity: { type: String, enum: Entities, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
  },
  { collection: "disabled" },
);

export const Disabled = mongoose.model("disabled", DisabledSchema);
