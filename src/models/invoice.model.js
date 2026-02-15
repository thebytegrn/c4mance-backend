import mongoose from "mongoose";

export const InvoiceSchema = new mongoose.Schema(
  {
    invoiceCode: String,
    dueAt: { type: Date, default: Date.now() + 3600 * 24 * 3 * 1000 },
    issuedAt: { type: Date, default: Date.now() },
    amount: String,
    status: String,
    customer: String,
  },
  { timestamps: true },
);

export const Invoice = mongoose.model("Invoice", InvoiceSchema);
