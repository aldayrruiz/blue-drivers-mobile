import { DietType } from '../type.model';

export interface CreatePayment {
  diet: string;
  type: DietType;
  liters?: number;
  amount: number;
  description?: string;
}
