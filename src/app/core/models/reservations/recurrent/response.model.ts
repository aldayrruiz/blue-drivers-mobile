import { Reservation } from '../..';

export interface CreateRecurrentResponse {
  description: string;
  successfulReservations: Reservation[];
  errorReservations: Reservation[];
}
