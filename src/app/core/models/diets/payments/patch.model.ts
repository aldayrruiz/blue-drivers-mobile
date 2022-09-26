import { PaymentType } from './type.model';

export interface PatchPayment {
  type: PaymentType;
  liters?: number;
  amount: number;
  description?: string;
  demand: boolean;
}
