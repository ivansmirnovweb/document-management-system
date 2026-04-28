import type { DocumentDeadlineState } from "../enums/document-deadline-state";
import type { DocumentStatus } from "../enums/document-status";
import type { DocumentKind } from "../enums/document-kind";
import type { IsoDateString } from "./common";
import type { Employer } from "./employer";
import type { User } from "./user";

export type DocumentListItem = {
  id: number;
  registrationNumber: string;
  registrationDate: IsoDateString;
  title: string;
  kind: DocumentKind;
  status: DocumentStatus;
  ownerId: number;
  executorId: number;
  employerId: number | null;
  dueDate: IsoDateString;
  completedAt?: IsoDateString | null;
  isControl: boolean;
  deadlineState: DocumentDeadlineState;
  deletedAt?: IsoDateString | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};

export type DocumentDetails = DocumentListItem & {
  description: string | null;
  incomingNumber: string | null;
  outgoingNumber: string | null;
  employer: Employer | null;
  owner: User;
  executor: User;
};

export type CreateDocumentInput = {
  registrationNumber: string;
  registrationDate: IsoDateString;
  title: string;
  kind: DocumentKind;
  description?: string | null;
  incomingNumber?: string | null;
  outgoingNumber?: string | null;
  employerId?: number | null;
  ownerId: number;
  executorId: number;
  dueDate: IsoDateString;
  isControl?: boolean;
};

export type UpdateDocumentInput = {
  registrationNumber?: string;
  registrationDate?: IsoDateString;
  title?: string;
  kind?: DocumentKind;
  description?: string | null;
  incomingNumber?: string | null;
  outgoingNumber?: string | null;
  employerId?: number | null;
  ownerId?: number;
  executorId?: number;
  dueDate?: IsoDateString;
  status?: DocumentStatus;
  isControl?: boolean;
};
