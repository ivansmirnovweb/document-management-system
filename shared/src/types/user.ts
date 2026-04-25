import type { IsoDateString } from "./common";
import type { UserRole } from "../enums/user-role";

export type User = {
  id: number;
  username: string;
  displayName: string;
  role: UserRole;
  passwordChangedAt?: IsoDateString | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};
