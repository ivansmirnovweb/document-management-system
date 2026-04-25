import { z } from "zod";
import { userSchema } from "./user";

export const loginRequestSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

export const loginResponseSchema = z
  .object({
    user: userSchema,
  })
  .strict();
