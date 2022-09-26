/* eslint-disable @typescript-eslint/naming-convention */
export interface CreateReservation {
  id?: string;
  title: string;
  date_stored?: string;
  start: string;
  end: string;
  description: string;
  owner?: string;
  vehicle: string;
  is_driver_needed: boolean;
}
