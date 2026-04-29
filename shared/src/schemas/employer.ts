import { z } from "zod";
import { isoDateStringSchema, requiredText } from "./common";

export const employerSchema = z
  .object({
    id: z.number().int().positive(),
    fullName: requiredText("Полное название"),
    shortName: requiredText("Краткое название"),
    legalAddress: requiredText("Юридический адрес"),
    actualAddress: requiredText("Фактический адрес"),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
    deletedAt: isoDateStringSchema.nullable().optional(),
  })
  .strict();

export const createEmployerInputSchema = z
  .object({
    fullName: requiredText("Полное название"),
    shortName: requiredText("Краткое название"),
    legalAddress: requiredText("Юридический адрес"),
    actualAddress: requiredText("Фактический адрес"),
  })
  .strict();

export const updateEmployerInputSchema = z
  .object({
    fullName: requiredText("Полное название").optional(),
    shortName: requiredText("Краткое название").optional(),
    legalAddress: requiredText("Юридический адрес").optional(),
    actualAddress: requiredText("Фактический адрес").optional(),
  })
  .strict();
