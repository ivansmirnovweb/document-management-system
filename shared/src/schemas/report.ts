import { z } from "zod";
import { DocumentStatus } from "../enums/document-status";
import { userSchema } from "./user";
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
export const executorStatisticsSchema = z
  .object({
    executor: userSchema,
    totalDocuments: z.number().int().nonnegative(),
    completedOnTime: z.number().int().nonnegative(),
    completedLate: z.number().int().nonnegative(),
    overdueCount: z.number().int().nonnegative(),
    overduePercentage: z.number(),
  })
  .strict();
