import { DietType } from '../type.model';

export interface PatchPayment {
  type: DietType;
  liters?: number;
  amount: number;
  description?: string;
}
