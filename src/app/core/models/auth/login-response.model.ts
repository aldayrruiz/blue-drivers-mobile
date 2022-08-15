/* eslint-disable @typescript-eslint/naming-convention */
import { Role, Tenant } from '..';

export interface LoginResponse {
  token: string;
  user_id: string;
  email: string;
  fullname: string;
  role: Role;
  tenant: Tenant;
}
