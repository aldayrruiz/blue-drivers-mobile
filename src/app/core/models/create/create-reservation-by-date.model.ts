/* eslint-disable @typescript-eslint/naming-convention */
export interface CreateReservationByDate {
  title: string;
  date_stored?: string;
  start: string;
  end: string;
  description: string;
  owner?: string;
  vehicles: string[];
  // Recurrent
  weekdays?: number[];
}
