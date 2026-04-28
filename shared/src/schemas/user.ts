import { z } from "zod";
import { UserRole } from "../enums/user-role.js";
import { isoDateStringSchema, requiredText } from "./common.js";

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
