export interface CreateRevision {
  id?: string;
  vehicle: string;
  date: string;
  kilometers: number;
  motive: string;
  garage: string;
  next_revision: string;
  next_kilometers: number;
  completed?: boolean;
}
