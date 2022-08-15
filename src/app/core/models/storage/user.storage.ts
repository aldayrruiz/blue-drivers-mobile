/* eslint-disable @typescript-eslint/naming-convention */

import { Tenant } from '..';
import { Role } from '../users/role.model';

export interface UserStorage {
  id: string;
  email: string;
  fullname: string;
  role: Role;
  token: string;
  tenant: Tenant;
}
