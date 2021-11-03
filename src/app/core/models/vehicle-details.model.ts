/* eslint-disable @typescript-eslint/naming-convention */
import { Reservation } from '.';

/**
 * This interface is used to charge the vehicle details page.
 * Reservation fields is important to display them, obviously.
 */
export interface VehicleDetails {
  id: string;
  name: string;
  brand: string;
  model: string;
  number_plate: string;
  date_stored: string;
  reservations: Reservation[];
}
