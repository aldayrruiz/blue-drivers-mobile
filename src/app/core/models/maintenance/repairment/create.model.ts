export interface CreateRepairment {
  id?: string;
  vehicle: string;
  date: string;
  location: string;
  description: string;
  kilometers: number;
}
