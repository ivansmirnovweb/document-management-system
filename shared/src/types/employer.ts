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

export type CreateEmployerInput = {
  fullName: string;
  shortName: string;
  legalAddress: string;
  actualAddress: string;
};

export type UpdateEmployerInput = Partial<CreateEmployerInput>;
