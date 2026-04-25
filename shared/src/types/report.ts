import type { DocumentStatus } from "../enums/document-status";
import type { IsoDateString } from "./common";

export type ReportFilterInput = {
  dateFrom: IsoDateString;
  dateTo: IsoDateString;
  executorId?: number;
  ownerId?: number;
  employerId?: number;
  status?: DocumentStatus;
  includeDeleted?: boolean;
};
