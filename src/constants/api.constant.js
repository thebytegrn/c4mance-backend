import axios from "axios";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

export const paystackAxios = axios.create({
  baseURL: "https://api.paystack.co",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${PAYSTACK_SECRET}`,
  },
});
