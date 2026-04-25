import { z } from "zod";
import { DocumentStatus } from "../enums/document-status";
import { isoDateStringSchema } from "./common";

export const reportFilterInputSchema = z
  .object({
    dateFrom: isoDateStringSchema,
    dateTo: isoDateStringSchema,
    executorId: z.number().int().positive().optional(),
    ownerId: z.number().int().positive().optional(),
    employerId: z.number().int().positive().optional(),
    status: z.nativeEnum(DocumentStatus).optional(),
    includeDeleted: z.boolean().optional(),
  })
  .strict();
