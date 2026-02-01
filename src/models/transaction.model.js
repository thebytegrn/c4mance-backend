import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  amount: { type: String, required: true },
  status: { type: String, required: true },
  reference: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  customerCode: { type: String, required: true },
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
