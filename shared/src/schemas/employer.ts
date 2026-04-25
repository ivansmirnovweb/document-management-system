import { z } from "zod";
import { isoDateStringSchema } from "./common";

export const employerSchema = z
  .object({
    id: z.number().int().positive(),
    fullName: z.string().min(1),
    shortName: z.string().min(1),
    legalAddress: z.string().min(1),
    actualAddress: z.string().min(1),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
    deletedAt: isoDateStringSchema.nullable().optional(),
  })
  .strict();
