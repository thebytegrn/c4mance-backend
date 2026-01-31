const PAYSTACK_DEFAULT_HEADERS = new Headers();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

PAYSTACK_DEFAULT_HEADERS.append("Content-Type", "application/json");
PAYSTACK_DEFAULT_HEADERS.append("Authorization", `Bearer ${PAYSTACK_SECRET}`);

export const headers = { PAYSTACK_DEFAULT_HEADERS };
