export interface CreateOdometer {
  id?: string;
  vehicle: string;
  date: string;
  kilometers: number;
  completed?: boolean;
}
