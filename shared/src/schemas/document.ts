import { z } from "zod";
import { DocumentStatus } from "../enums/document-status";
import { employerSchema } from "./employer";
import { isoDateStringSchema } from "./common";
import { userSchema } from "./user";

export const documentListItemSchema = z
  .object({
    id: z.number().int().positive(),
    registrationNumber: z.string().min(1),
    registrationDate: isoDateStringSchema,
    title: z.string().min(1),
    status: z.nativeEnum(DocumentStatus),
    ownerId: z.number().int().positive(),
    executorId: z.number().int().positive(),
    employerId: z.number().int().positive().nullable(),
    dueDate: isoDateStringSchema,
    completedAt: isoDateStringSchema.nullable().optional(),
    isControl: z.boolean(),
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
    registrationNumber: z.string().min(1),
    registrationDate: isoDateStringSchema,
    title: z.string().min(1),
    description: z.string().nullable().optional(),
    incomingNumber: z.string().nullable().optional(),
    outgoingNumber: z.string().nullable().optional(),
    employerId: z.number().int().positive().nullable().optional(),
    ownerId: z.number().int().positive(),
    executorId: z.number().int().positive(),
    dueDate: isoDateStringSchema,
    isControl: z.boolean().optional(),
  })
  .strict();

export const updateDocumentInputSchema = z
  .object({
    registrationNumber: z.string().min(1).optional(),
    registrationDate: isoDateStringSchema.optional(),
    title: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    incomingNumber: z.string().nullable().optional(),
    outgoingNumber: z.string().nullable().optional(),
    employerId: z.number().int().positive().nullable().optional(),
    ownerId: z.number().int().positive().optional(),
    executorId: z.number().int().positive().optional(),
    dueDate: isoDateStringSchema.optional(),
    status: z.nativeEnum(DocumentStatus).optional(),
    completedAt: isoDateStringSchema.nullable().optional(),
    isControl: z.boolean().optional(),
  })
  .strict();
