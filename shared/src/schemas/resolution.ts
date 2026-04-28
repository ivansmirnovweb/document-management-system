import { z } from "zod";
import { isoDateStringSchema, requiredText } from "./common";
import { userSchema } from "./user";

export const resolutionSchema = z.object({
  id: z.number().int().positive(),
  documentId: z.number().int().positive(),
  authorId: z.number().int().positive(),
  text: requiredText("Resolution text"),
  resolutionDate: isoDateStringSchema,
  dueDate: isoDateStringSchema,
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
  author: userSchema,
}).strict();

export const createResolutionInputSchema = z.object({
  text: requiredText("Resolution text"),
  resolutionDate: isoDateStringSchema,
  dueDate: isoDateStringSchema,
}).strict();

export const updateResolutionInputSchema = z.object({
  text: requiredText("Resolution text").optional(),
  resolutionDate: isoDateStringSchema.optional(),
  dueDate: isoDateStringSchema.optional(),
}).strict();
