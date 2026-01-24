import mongoose from "mongoose";
import { DisabledEntities } from "../constants/disabledEntities.constant.js";

const DisabledSchema = new mongoose.Schema(
  {
    entityId: { type: mongoose.Types.ObjectId, required: true, index: true },
    entity: { type: String, enum: DisabledEntities, required: true },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
  },
  { collection: "disabled" },
);

export const Disabled = mongoose.model("disabled", DisabledSchema);
