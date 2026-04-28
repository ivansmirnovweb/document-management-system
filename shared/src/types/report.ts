import type { DocumentStatus } from "../enums/document-status.js";
import type { IsoDateString } from "./common.js";
import type { User } from "./user.js";

export type ReportFilterInput = {
  dateFrom: IsoDateString;
  dateTo: IsoDateString;
  executorId?: number;
  ownerId?: number;
  employerId?: number;
  status?: DocumentStatus;
  includeDeleted?: boolean;
};

export type ExecutorStatistics = {
  executor: User;
  totalDocuments: number;
  completedOnTime: number;
  completedLate: number;
  overdueCount: number;
  overduePercentage: number;
};
