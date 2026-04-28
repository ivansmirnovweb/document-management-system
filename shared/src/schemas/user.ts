import { z } from "zod";
import { UserRole } from "../enums/user-role";
import { isoDateStringSchema, requiredText } from "./common";

export const userSchema = z
  .object({
    id: z.number().int().positive(),
    username: requiredText("Username"),
    displayName: requiredText("Display name"),
    role: z.nativeEnum(UserRole),
    passwordChangedAt: isoDateStringSchema.nullable().optional(),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
  })
  .strict();
