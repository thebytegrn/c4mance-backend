import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async function (options) {
  const { from, to, subject, html } = options;
  await resend.emails.send({ from, to, subject, html });
};
