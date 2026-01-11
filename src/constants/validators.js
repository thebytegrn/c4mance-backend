import z, { toUpperCase } from "zod";

export const signUpValidator = z.object({
  firstName: z
    .string()
    .min(2)
    .transform((val) => toUpperCase(val)),
  lastName: z
    .string()
    .min(2)
    .transform((val) => toUpperCase(val)),
  email: z.email(),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

export const loginValidator = z.object({
  email: z.email(),
  password: z.string(),
});
