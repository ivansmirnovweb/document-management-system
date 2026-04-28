import { z } from "zod";
import { DocumentDeadlineState } from "../enums/document-deadline-state";
import { DocumentStatus } from "../enums/document-status";
import { employerSchema } from "./employer";
import { isoDateStringSchema, requiredText } from "./common";
import { userSchema } from "./user";

export const documentListItemSchema = z
  .object({
    id: z.number().int().positive(),
    registrationNumber: requiredText("Registration number"),
    registrationDate: isoDateStringSchema,
    title: requiredText("Title"),
    status: z.nativeEnum(DocumentStatus),
    ownerId: z.coerce.number().int().positive("Owner ID must be a positive number"),
    executorId: z.coerce.number().int().positive("Executor ID must be a positive number"),
    employerId: z.number().int().positive().nullable(),
    dueDate: isoDateStringSchema,
    completedAt: isoDateStringSchema.nullable().optional(),
    isControl: z.boolean(),
    deadlineState: z.nativeEnum(DocumentDeadlineState),
    deletedAt: isoDateStringSchema.nullable().optional(),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
  })
  .strict();

export const documentDetailsSchema = documentListItemSchema
  .extend({
    description: z.string().nullable(),
    incomingNumber: z.string().nullable(),
    outgoingNumber: z.string().nullable(),
    employer: employerSchema.nullable(),
    owner: userSchema,
    executor: userSchema,
  })
  .strict();

export const createDocumentInputSchema = z
  .object({
    registrationNumber: requiredText("Registration number"),
    registrationDate: isoDateStringSchema,
    title: requiredText("Title"),
    description: z.string().nullable().optional(),
    incomingNumber: z.string().nullable().optional(),
    outgoingNumber: z.string().nullable().optional(),
    employerId: z.number().int().positive().nullable().optional(),
    ownerId: z.coerce.number().int().positive("Owner ID must be a positive number"),
    executorId: z.coerce.number().int().positive("Executor ID must be a positive number"),
    dueDate: isoDateStringSchema,
    isControl: z.boolean().optional(),
  })
  .strict();

export const updateDocumentInputSchema = z
  .object({
    registrationNumber: requiredText("Registration number").optional(),
    registrationDate: isoDateStringSchema.optional(),
    title: requiredText("Title").optional(),
    description: z.string().nullable().optional(),
    incomingNumber: z.string().nullable().optional(),
    outgoingNumber: z.string().nullable().optional(),
    employerId: z.number().int().positive().nullable().optional(),
    ownerId: z.coerce.number().int().positive("Owner ID must be a positive number").optional(),
    executorId: z.coerce.number().int().positive("Executor ID must be a positive number").optional(),
    dueDate: isoDateStringSchema.optional(),
    status: z.nativeEnum(DocumentStatus).optional(),
    isControl: z.boolean().optional(),
  })
  .strict();
