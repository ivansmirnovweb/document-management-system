import { z } from "zod";
import { requiredText } from "./common";
import { userSchema } from "./user";

export const authUserSchema = userSchema.extend({
  passwordRotationRequired: z.boolean(),
});

const usernameSchema = z
  .string()
  .trim()
  .min(3, "Имя пользователя должно быть не короче 3 символов")
  .max(100, "Имя пользователя должно быть не длиннее 100 символов")
  .regex(/^[a-z0-9._-]+$/, "Имя пользователя может содержать только строчные латинские буквы, цифры, точку, подчёркивание и дефис");

const passwordSchema = z.string().min(8, "Пароль должен быть не короче 8 символов");

export const loginRequestSchema = z
  .object({
    username: requiredText("Имя пользователя"),
    password: z.string().min(1, "Пароль — обязательное поле"),
  })
  .strict();

export const registerRequestSchema = z
  .object({
    username: usernameSchema,
    displayName: requiredText("Display name"),
    unit: requiredText("Unit"),
    password: passwordSchema,
  })
  .strict();

export const changePasswordRequestSchema = z
  .object({
    currentPassword: z.string().min(1, "Текущий пароль — обязательное поле"),
    newPassword: passwordSchema,
  })
  .strict();

export const loginResponseSchema = z
  .object({
    user: authUserSchema,
  })
  .strict();

export const registerResponseSchema = z
  .object({
    user: authUserSchema,
  })
  .strict();

export const changePasswordResponseSchema = z
  .object({
    user: authUserSchema,
  })
  .strict();
