import { CleaningType } from './type.model';

export interface CreateCleaning {
  id?: string;
  vehicle: string;
  date: string;
  type: CleaningType;
  completed?: boolean;
}
