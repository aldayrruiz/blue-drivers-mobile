/* eslint-disable @typescript-eslint/naming-convention */
import { Recurrent, User, Vehicle } from '.';

export interface Reservation {
  id?: string;
  title: string;
  date_stored?: string;
  start: string;
  end: string;
  description: string;
  owner?: User;
  vehicle: Vehicle;
  is_cancelled: boolean;
  is_recurrent: boolean;
  recurrent?: Recurrent;
}
