import { DietType } from '../type.model';

export interface CreateDiet {
  collection: string;
  type: DietType;
  liters?: number;
  amount: number;
  description?: string;
}
