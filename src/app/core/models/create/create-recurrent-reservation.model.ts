export interface CreateRecurrentReservation {
  title: string;
  description: string;
  startReservationTime: string;
  endReservationTime: string;
  weekdays: number[];
  startReservations: string;
  endReservations: string;
  vehicles: string[];
}
