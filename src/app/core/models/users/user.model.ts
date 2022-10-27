import { Role } from './role.model';

/* eslint-disable @typescript-eslint/naming-convention */
export interface User {
  id: string;
  email: string;
  fullname: string;
  date_joined: string;
  role: Role;
}
