import z from "zod";
import { capitalize } from "../utils/capitalize.utils.js";
import { DEPARTMENT_ROLES } from "./departmentRoles.constants.js";

export const signInValidator = z.object({
  email: z.email(),
  password: z.string(),
});

export const signUpValidator = z.object({
  firstName: z
    .string()
    .min(2)
    .transform((val) => capitalize(val)),
  lastName: z
    .string()
    .min(2)
    .transform((val) => capitalize(val)),
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

export const createOrgValidator = z.object({
  name: z.string(),
  email: z.email(),
  address: z.string(),
});

const departmentRoleSchema = z.enum(DEPARTMENT_ROLES);

export const addOrgDepartmentValidator = z.object({
  name: z.string(),
  roles: z.array(departmentRoleSchema),
});
