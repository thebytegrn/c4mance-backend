import mongoose from "mongoose";
import { Entities } from "../constants/entities.constant.js";

const DeletedSchema = new mongoose.Schema(
  {
    entityId: { type: mongoose.Types.ObjectId, required: true },
    entity: { type: String, enum: Entities, required: true },
    createdAt: { type: Date, default: Date.now() },
  },
  { collection: "deleted" },
);

export const Deleted = mongoose.model("deleted", DeletedSchema);
