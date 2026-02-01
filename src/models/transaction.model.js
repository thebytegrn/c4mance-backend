import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  reference: { type: String, index: true, required: true },
  customerCode: { type: String, index: true, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
