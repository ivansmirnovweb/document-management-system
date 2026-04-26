import { z } from "zod";
import { userSchema } from "./user";
import { requiredText } from "./common";

export const loginRequestSchema = z
  .object({
    username: requiredText("Username"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .strict();

export const loginResponseSchema = z
  .object({
    user: userSchema,
  })
  .strict();

export const changePasswordResponseSchema = z
  .object({
    user: userSchema,
  })
  .strict();
