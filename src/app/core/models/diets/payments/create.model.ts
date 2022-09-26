import { PaymentType } from './type.model';

export interface CreatePayment {
  diet: string;
  type: PaymentType;
  liters?: number;
  amount: number;
  description?: string;
  demand: boolean;
}
