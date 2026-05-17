import { z } from "zod";
import { DocumentDeadlineState } from "../enums/document-deadline-state";
import { DocumentStatus } from "../enums/document-status";
import { DocumentKind } from "../enums/document-kind";
import { employerSchema } from "./employer";
import { isoDateStringSchema, requiredText } from "./common";
import { userSchema } from "./user";
import { resolutionSchema } from "./resolution";

export const documentListItemSchema = z
  .object({
    id: z.number().int().positive(),
    registrationNumber: requiredText("Регистрационный номер"),
    registrationDate: isoDateStringSchema,
    title: requiredText("Название"),
    about1: requiredText("Тема 1"),
    about2: z.string().nullable(),
    kind: z.nativeEnum(DocumentKind),
    status: z.nativeEnum(DocumentStatus),
    ownerId: z.coerce.number().int().positive("ID владельца должен быть положительным числом"),
    executorId: z.coerce.number().int().positive("ID исполнителя должен быть положительным числом"),
    employerId: z.number().int().positive().nullable(),
    outSenderEmployerId: z.number().int().positive().nullable(),
    outgoingDate: isoDateStringSchema.nullable(),
    broadcast: z.string(),
    dueDate: isoDateStringSchema,
    completedAt: isoDateStringSchema.nullable().optional(),
    writtenOffAt: isoDateStringSchema.nullable().optional(),
    isControl: z.boolean(),
    deadlineState: z.nativeEnum(DocumentDeadlineState),
    deletedAt: isoDateStringSchema.nullable().optional(),
    createdAt: isoDateStringSchema,
    updatedAt: isoDateStringSchema,
    lastChangedAt: isoDateStringSchema,
    owner: userSchema,
    executor: userSchema,
    employer: employerSchema.nullable(),
    outSenderEmployer: employerSchema.nullable(),
  })
  .strict();

export const documentDetailsSchema = documentListItemSchema
  .extend({
    description: z.string().nullable(),
    incomingNumber: z.string().nullable(),
    outgoingNumber: z.string().nullable(),
    resolutions: z.array(resolutionSchema),
    lastChangedBy: userSchema,
  })
  .strict();

export const createDocumentInputSchema = z
  .object({
    registrationNumber: requiredText("Регистрационный номер"),
    registrationDate: isoDateStringSchema,
    title: requiredText("Название"),
    about1: requiredText("Тема 1"),
    about2: z.string().nullable().optional(),
    kind: z.nativeEnum(DocumentKind),
    description: z.string().nullable().optional(),
    incomingNumber: z.string().nullable().optional(),
    outgoingNumber: z.string().nullable().optional(),
    outgoingDate: isoDateStringSchema.nullable().optional(),
    employerId: z.number().int().positive("ID работодателя должен быть положительным числом"),
    outSenderEmployerId: z.number().int().positive().nullable().optional(),
    broadcast: z.string().optional(),
    ownerId: z.coerce.number().int().positive("ID владельца должен быть положительным числом"),
    executorId: z.coerce.number().int().positive("ID исполнителя должен быть положительным числом"),
    dueDate: isoDateStringSchema.optional(),
    isControl: z.boolean().optional(),
  })
  .superRefine((input, ctx) => {
    const hasOutgoingNumber = (input.outgoingNumber ?? "").trim().length > 0;
    const hasOutgoingDate = Boolean(input.outgoingDate);

    if (input.kind === DocumentKind.OUTGOING) {
      if (!hasOutgoingNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outgoingNumber"],
          message: "Исходящий номер обязателен для исходящего документа",
        });
      }
      if (!hasOutgoingDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["outgoingDate"],
          message: "Дата исходящего обязательна для исходящего документа",
        });
      }
    }
  })
  .strict();

export const updateDocumentInputSchema = z
  .object({
    registrationNumber: requiredText("Регистрационный номер").optional(),
    registrationDate: isoDateStringSchema.optional(),
    title: requiredText("Название").optional(),
    about1: requiredText("Тема 1").optional(),
    about2: z.string().nullable().optional(),
    kind: z.nativeEnum(DocumentKind).optional(),
    description: z.string().nullable().optional(),
    incomingNumber: z.string().nullable().optional(),
    outgoingNumber: z.string().nullable().optional(),
    outgoingDate: isoDateStringSchema.nullable().optional(),
    employerId: z.number().int().positive().nullable().optional(),
    outSenderEmployerId: z.number().int().positive().nullable().optional(),
    broadcast: z.string().optional(),
    ownerId: z.coerce.number().int().positive("ID владельца должен быть положительным числом").optional(),
    executorId: z.coerce.number().int().positive("ID исполнителя должен быть положительным числом").optional(),
    dueDate: isoDateStringSchema.optional(),
    status: z.nativeEnum(DocumentStatus).optional(),
    isControl: z.boolean().optional(),
  })
  .superRefine((input, ctx) => {
    if (input.kind !== DocumentKind.OUTGOING) {
      return;
    }

    const hasOutgoingNumber = (input.outgoingNumber ?? "").trim().length > 0;
    const hasOutgoingDate = Boolean(input.outgoingDate);

    if (!hasOutgoingNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["outgoingNumber"],
        message: "Исходящий номер обязателен для исходящего документа",
      });
    }
    if (!hasOutgoingDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["outgoingDate"],
        message: "Дата исходящего обязательна для исходящего документа",
      });
    }
  })
  .strict();
