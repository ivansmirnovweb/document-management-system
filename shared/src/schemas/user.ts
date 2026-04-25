import { z } from "zod";
import { UserRole } from "../enums/user-role";
import { isoDateStringSchema } from "./common";

export const userSchema = z
  .object({
    id: z.number().int().positive(),
    username: z.string().min(1),
    displayName: z.string().min(1),
    role: z.nativeEnum(UserRole),
    passwordChangedAt: isoDateStringSchema.nullable().optional(),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
  })
  .strict();
