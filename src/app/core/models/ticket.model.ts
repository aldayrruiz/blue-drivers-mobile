/* eslint-disable @typescript-eslint/naming-convention */
import { Reservation, TicketStatus, User } from '.';

export interface Ticket {
  id: string;
  title: string;
  date_stored: string;
  description: string;
  reservation: Reservation;
  owner: User;
  status: TicketStatus;
}
