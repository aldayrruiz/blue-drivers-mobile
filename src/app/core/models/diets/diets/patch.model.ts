import { DietType } from '../type.model';

export interface PatchDiet {
  type: DietType;
  liters?: number;
  amount: number;
  description?: string;
}
