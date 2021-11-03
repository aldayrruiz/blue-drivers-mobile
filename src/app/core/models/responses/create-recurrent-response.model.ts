import { Reservation } from '../reservation.model';

export interface CreateRecurrentResponse {
  description: string;
  successfulReservations: Reservation[];
  errorReservations: Reservation[];
}
