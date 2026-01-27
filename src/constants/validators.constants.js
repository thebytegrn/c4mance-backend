import z from "zod";
import { capitalize } from "../utils/capitalize.utils.js";
import { DEPARTMENT_ROLES } from "./departmentRoles.constant.js";

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
      "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
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

export const orgMemberValidator = z.object({
  user: signUpValidator.omit({ password: true }).extend({ phone: z.string() }),
  departmentId: z.string(),
  departmentRole: z.enum(DEPARTMENT_ROLES),
  reportingLine: z.string(DEPARTMENT_ROLES),
  redirectURL: z.url(),
});

export const memberAcceptInviteValidator = signUpValidator.pick({
  password: true,
});

export const editOrgDepartmentValidator = z.object({
  firstName: z
    .string()
    .min(2)
    .transform((val) => capitalize(val)),
  lastName: z
    .string()
    .min(2)
    .transform((val) => capitalize(val)),
  phone: z.string(),
});

export const DisabledValidator = z.object({
  reason: z.string(),
});
