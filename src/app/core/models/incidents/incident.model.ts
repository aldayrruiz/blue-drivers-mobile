/* eslint-disable @typescript-eslint/naming-convention */
import { IncidentType, Reservation, User } from '..';

export interface Incident {
  id: string;
  date_stored: string;
  description: string;
  owner: User;
  reservation: Reservation;
  type: IncidentType;
  photo: string;
}
