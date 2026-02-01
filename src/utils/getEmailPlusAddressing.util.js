import crypto from "crypto";

export const getEmailPlusAddressing = (email) => {
  const split = email.split("@");

  const randomInt = crypto.randomInt(10000, 90000);

  return split[0] + "+" + randomInt + "@" + split[split.length - 1];
};
