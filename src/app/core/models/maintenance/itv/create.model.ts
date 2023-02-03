export interface CreateItv {
  id?: string;
  vehicle: string;
  date: string;
  passed: boolean;
  next_revision: string;
  completed?: boolean;
}
