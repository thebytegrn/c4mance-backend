import mongoose from "mongoose";

export const InvoiceSchema = new mongoose.Schema(
  {
    invoiceCode: { type: String, required: true },
    issueDate: { type: Date, required: true },
    dueDate: Date,
    amountDue: { type: Number, required: true },
    status: String,
    customer: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { timestamps: true },
);
