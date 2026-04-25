import type { IsoDateString } from "./common";

export type Employer = {
  id: number;
  fullName: string;
  shortName: string;
  legalAddress: string;
  actualAddress: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
  deletedAt?: IsoDateString | null;
};
