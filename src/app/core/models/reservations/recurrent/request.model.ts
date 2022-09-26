export interface CreateRecurrentReservation {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  recurrent: string;
  vehicles: string[];
  is_driver_needed: boolean;
}
