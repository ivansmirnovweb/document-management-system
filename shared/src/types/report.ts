import type { DocumentStatus } from "../enums/document-status";
import type { IsoDateString } from "./common";
import type { User } from "./user";

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
