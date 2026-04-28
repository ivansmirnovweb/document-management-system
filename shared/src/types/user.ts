import type { IsoDateString } from "./common.js";
import type { UserRole } from "../enums/user-role.js";

export type User = {
  id: number;
  username: string;
  displayName: string;
  role: UserRole;
  passwordChangedAt?: IsoDateString | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
};
