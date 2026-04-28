import { z } from "zod";
import { userSchema } from "./user";
import { requiredText } from "./common";

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(100, "Username must be at most 100 characters")
  .regex(/^[a-z0-9._-]+$/, "Username can contain only lowercase letters, numbers, dot, underscore, and hyphen");

const passwordSchema = z.string().min(8, "Password must be at least 8 characters");

export const loginRequestSchema = z
  .object({
    username: requiredText("Username"),
    password: z.string().min(1, "Password is required"),
  })
  .strict();

export const registerRequestSchema = z
  .object({
    username: usernameSchema,
    displayName: requiredText("Display name"),
    password: passwordSchema,
  })
  .strict();

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
  })
  .strict();

export const loginResponseSchema = z
  .object({
    user: userSchema,
  })
  .strict();

export const registerResponseSchema = z
  .object({
    user: userSchema,
  })
  .strict();

export const changePasswordResponseSchema = z
  .object({
    user: userSchema,
  })
  .strict();
