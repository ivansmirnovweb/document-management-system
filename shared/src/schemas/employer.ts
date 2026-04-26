import { z } from "zod";
import { isoDateStringSchema, requiredText } from "./common";

export const employerSchema = z
  .object({
    id: z.number().int().positive(),
    fullName: requiredText("Full name"),
    shortName: requiredText("Short name"),
    legalAddress: requiredText("Legal address"),
    actualAddress: requiredText("Actual address"),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
    deletedAt: isoDateStringSchema.nullable().optional(),
  })
  .strict();

export const createEmployerInputSchema = z
  .object({
    fullName: requiredText("Full name"),
    shortName: requiredText("Short name"),
    legalAddress: requiredText("Legal address"),
    actualAddress: requiredText("Actual address"),
  })
  .strict();

export const updateEmployerInputSchema = z
  .object({
    fullName: requiredText("Full name").optional(),
    shortName: requiredText("Short name").optional(),
    legalAddress: requiredText("Legal address").optional(),
    actualAddress: requiredText("Actual address").optional(),
  })
  .strict();
