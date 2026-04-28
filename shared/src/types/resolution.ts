import type { IsoDateString } from "./common";
import type { User } from "./user";

export type Resolution = {
  id: number;
  documentId: number;
  authorId: number;
  text: string;
  resolutionDate: IsoDateString;
  dueDate: IsoDateString;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  author: User;
};

export type CreateResolutionInput = {
  text: string;
  resolutionDate: IsoDateString;
  dueDate: IsoDateString;
};

export type UpdateResolutionInput = {
  text?: string;
  resolutionDate?: IsoDateString;
  dueDate?: IsoDateString;
};
